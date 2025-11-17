import { View, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList, Alert} from "react-native";
import Header from "../../components/header";
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import TripsListCard from "../../components/tripListCard";
import { Trip } from "@/services/types";
import { tripService } from "@/services/tripService";
import BuyTicketModal from "@/components/BuyTicketModal";




export default function BuyTripPage() {

    const [departureTrips, setDepartureTrips] = useState<Trip[]>([]);
    const [returnTrips, setReturnTrips] = useState<Trip[]>([]);
    

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    const [departureDateDisplay, setDepartureDateDisplay] = useState('');
    const [returnDateDisplay, setReturnDateDisplay] = useState('');

    const [showDeparturePicker, setShowDeparturePicker] = useState(false);
    const [showReturnPicker, setShowReturnPicker] = useState(false);
    const [terminalPickerOpen, setTerminalPickerOpen] = useState(false);
    const [terminalValue, setTerminalValue] = useState('');
    const [terminalItems, setTerminalItems] = useState([
        { label: 'Ponta da Espera', value: 'Ponta da Espera' },
        { label: 'Cujupe', value: 'Cujupe' },
    ]);

    const [tripType, setTripType] = useState("oneway");

    const fetchDepartureTrips = async (departureDate: string) =>  {
        setLoading(true);
        setError(null);

        if (!terminalValue) {
            Alert.alert("Selecione um terminal de partida")
            return
        }

        try {
            const terminal = terminalValue || undefined;
            const tripsData = await tripService.getTripsByDate(departureDate, terminal);
            
            setDepartureTrips(tripsData);
        } catch (err: any) {
            console.error('Erro ao buscar viagens:', err);
            setError(err.message || 'Erro ao carregar viagens');
            setDepartureTrips([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchReturnTrips = async (returnDate: string) =>  {
        setLoading(true);
        setError(null);

        try {
            let terminal = '';

            if (terminalValue === "Ponta da Espera") {
                terminal = "Cujupe";
            }
            else {
                terminal = "Ponta da Espera";
            }
            const tripsData = await tripService.getTripsByDate(returnDate, terminal);
            
            setReturnTrips(tripsData);
        } catch (err: any) {
            console.error('Erro ao buscar viagens:', err);
            setError(err.message || 'Erro ao carregar viagens');
            setReturnTrips([]);
        } finally {
            setLoading(false);
        }
    }

    const handleBuyPress = (trip: Trip) => {
        setSelectedTrip(trip);
        setModalVisible(true);
    };

    function formatDate(date : any) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function formatDateToDisplay(date : any) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedTrip(null);
    };
    

    return (  
        <View style={styles.container}>

            

                <Header
                    title="Comprar Passagem"
                    subtitle="Escolha seu destino e horário"
                />

                <View style={styles.pickerContainer}>
                    <Text style={{ color: '#4A5565', paddingTop: 20, paddingBottom: 20, fontSize: 16 }}>
                        Terminal de partida
                    </Text>

                    <DropDownPicker
                        open={terminalPickerOpen}
                        value={terminalValue}
                        items={terminalItems}
                        setOpen={setTerminalPickerOpen}
                        setValue={setTerminalValue}
                        setItems={setTerminalItems}
                        placeholder="Selecione..."
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 50 }}
            >

                <View style={styles.tripTypeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tripButton,
                            tripType === "oneway" ? styles.activeButton : styles.inactiveButton
                        ]}
                        onPress={() => setTripType("oneway")}
                    >
                        <Text
                            style={[
                                styles.tripButtonText,
                                tripType === "oneway" ? styles.activeText : styles.inactiveText
                            ]}
                        >
                            Somente Ida
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tripButton,
                            tripType === "roundtrip" ? styles.activeButton : styles.inactiveButton
                        ]}
                        onPress={() => setTripType("roundtrip")}
                    >
                        <Text
                            style={[
                                styles.tripButtonText,
                                tripType === "roundtrip" ? styles.activeText : styles.inactiveText
                            ]}
                        >
                            Ida e Volta
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dateCard}>

                    <Text style={styles.dateLabel}>Data de ida</Text>
                    <TouchableOpacity 
                        style={styles.dateInput}
                        onPress={() => setShowDeparturePicker(true)}>
                        <Text style={styles.dateText}>
                            {departureDateDisplay || "Selecionar data de ida"}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={showDeparturePicker}
                        mode="date"
                        onConfirm={(date) => {
                            setShowDeparturePicker(false);          
                            setDepartureDateDisplay(formatDateToDisplay(date));
                            fetchDepartureTrips(formatDate(date))
                        }}
                        onCancel={() => setShowDeparturePicker(false)}
                    />


                    {tripType === "roundtrip" && (
                        <>
                            <Text style={[styles.dateLabel, { marginTop: 15 }]}>Data de volta</Text>
                            <TouchableOpacity 
                                style={styles.dateInput}
                                onPress={() => setShowReturnPicker(true)}>

                                <Text style={styles.dateText}>
                                    {returnDateDisplay || "Selecionar data de volta"}
                                </Text>

                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={showReturnPicker}
                                mode="date"
                                onConfirm={(date) => {
                                    setShowReturnPicker(false);
                                    setReturnDateDisplay(formatDateToDisplay(date));
                                    fetchReturnTrips(formatDate(date))
                                }}
                                onCancel={() => setShowReturnPicker(false)}
                            />
                    
                        </>
                    )}
                </View>
                
                <View>
                    <TripsListCard title="Horários de Ida" trips={departureTrips} onBuyPress={handleBuyPress}></TripsListCard>
                </View>

                {tripType === "roundtrip" ? (
                    <View>
                    <TripsListCard title="Horários de Volta" trips={returnTrips} onBuyPress={handleBuyPress}></TripsListCard>
                </View>
                ) : null}

            </ScrollView>

            <BuyTicketModal
            visible={modalVisible}
            trip={selectedTrip}
            onClose={handleCloseModal}
          />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#ffff',
      },
    pickerContainer: {
        marginLeft:30,
    },
    dropdown: {
        borderColor: '#BEDBFF',
        borderRadius: 10,
        width: "75%",
        
      },
      dropdownContainer: {
        borderColor: '#BEDBFF',
        borderRadius: 10,
        width: "75%",
      },
      tripTypeContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 20,
        width: "100%",
        paddingHorizontal: 15,   
    },
    
    tripButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: 5,
        borderWidth: 1,
    },
    
    activeButton: {
        backgroundColor: "#155DFC",
        borderColor: "#155DFC",
    },
    
    inactiveButton: {
        backgroundColor: "#FFFFFF",
        borderColor: "#D1D5DC",
    },
    
    tripButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    
    activeText: {
        color: "#FFFFFF",
    },
    
    inactiveText: {
        color: "#4A5565",
    },

    dateCard: {
        backgroundColor: "#FFF",
        marginTop: 20,
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 12,
    
        // sombra para iOS
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    
        // sombra para Android
        elevation: 4,
    },
    
    dateLabel: {
        fontSize: 14,
        color: "#4A5565",
        marginBottom: 6,
        fontWeight: "600",
    },
    
    dateInput: {
        borderWidth: 1,
        borderColor: "#D1D5DC",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    
    dateText: {
        fontSize: 14,
        color: "#4A5565",
    }
    

});