import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TripsListCard from '../../components/tripListCard';
import Header from '../../components/header';
import BuyTicketModal from '../../components/BuyTicketModal';
import { tripService } from '../../services/tripService';
import { Trip } from '../../services/types';
import { router } from 'expo-router';

export default function Home() {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [terminalValue, setTerminalValue] = useState('');
    const [terminalItems, setTerminalItems] = useState([
        { label: 'Ponta da Espera', value: 'Ponta da Espera' },
        { label: 'Cujupe', value: 'Cujupe' },
    ]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

    // Função para obter a data de hoje no formato YYYY-MM-DD
    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Função para buscar viagens
    const fetchTrips = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const today = getTodayDate();
            const terminal = terminalValue || undefined;
            const tripsData = await tripService.getTripsByDate(today, terminal);

            
            setTrips(tripsData);
        } catch (err: any) {
            console.error('Erro ao buscar viagens:', err);
            setError(err.message || 'Erro ao carregar viagens');
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    // Busca viagens quando o componente é montado ou quando o terminal muda
    useEffect(() => {
        fetchTrips();
    }, [terminalValue]);

    const handleBuyPress = (trip: Trip) => {
        setSelectedTrip(trip);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedTrip(null);
    };

    const handlePurchaseSuccess = () => {
        // Recarrega as viagens após compra bem-sucedida
        fetchTrips();
    };

    return (
        <View style={styles.container}>

            <Header title="Vai de Ferry" subtitle="Sua viagem começa aqui" />
          
            <View style={styles.pickerContainer}>
                <Text style={{color: '#4A5565', paddingTop: 20, paddingBottom: 20, fontSize: 16}}>Terminal de partida</Text>

                <DropDownPicker
                    open={pickerOpen}
                    value={terminalValue}
                    items={terminalItems}
                    setOpen={setPickerOpen}
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

            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push("/myTripsPage")}>
            <MaterialCommunityIcons
                name="qrcode-scan"
                size={22}
                color="#fff"
                style={styles.icon}
            />
                <Text style={styles.buttonLabel}>Fazer Check-in</Text>
            </TouchableOpacity>   

            <View>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#155DFC" />
                        <Text style={styles.loadingText}>Carregando viagens...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity 
                            style={styles.retryButton} 
                            onPress={fetchTrips}
                        >
                            <Text style={styles.retryButtonText}>Tentar novamente</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TripsListCard 
                        title="Próximos Horários" 
                        trips={trips}
                        onBuyPress={handleBuyPress}
                    />
                )}
            </View>

          </ScrollView>

          {/* Modal de compra de passagem */}
          <BuyTicketModal
            visible={modalVisible}
            trip={selectedTrip}
            onClose={handleCloseModal}
            onSuccess={handlePurchaseSuccess}
          />
            
        </View>
    );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffff',
    },
    
    text: {
      color: '#4A5565',
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
      button: {
        width: '85%',
        backgroundColor: '#00D3F3',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6, // sombra no Android
        alignSelf: 'center',
        margin:20,
      },
      buttonLabel: {
        color: '#fff',
        fontSize: 16,
      },
      icon: {
        marginRight: 8,
      },
      loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
      },
      loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
      },
      errorContainer: {
        padding: 20,
        alignItems: 'center',
        marginHorizontal: 20,
      },
      errorText: {
        color: '#E7000B',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
      },
      retryButton: {
        backgroundColor: '#155DFC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
      },
      retryButtonText: {
        color: '#fff',
        fontWeight: '600',
      },
  });