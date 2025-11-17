import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Trip, CarType } from '../services/types';
import { carTypeService } from '../services/carTypeService';
import { ticketService } from '../services/ticketService';

interface BuyTicketModalProps {
  visible: boolean;
  trip: Trip | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BuyTicketModal({
  visible,
  trip,
  onClose,
  onSuccess,
}: BuyTicketModalProps) {
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [selectedCarType, setSelectedCarType] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCarTypes, setLoadingCarTypes] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Busca tipos de carro quando o modal é aberto
  useEffect(() => {
    if (visible && trip) {
      loadCarTypes();
    } else {
      // Reseta o estado quando o modal é fechado
      setSelectedCarType(null);
    }
  }, [visible, trip]);

  const loadCarTypes = async () => {
    setLoadingCarTypes(true);
    try {
      const types = await carTypeService.getAllCarTypes();
      setCarTypes(types);
    } catch (error: any) {
      console.error('Erro ao carregar tipos de carro:', error);
      Alert.alert('Erro', 'Não foi possível carregar os tipos de veículo.');
    } finally {
      setLoadingCarTypes(false);
    }
  };

  // Função para formatar data e horário
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}`,
      };
    } catch (error) {
      return { date: '--/--/----', time: '--:--' };
    }
  };

  // Calcula o preço total
  const calculateTotal = () => {
    if (!trip) return 0;
    const tripPrice = trip.price;
    const carCost = selectedCarType?.cost || 0;
    return tripPrice + carCost;
  };

  // Função para comprar o ticket
  const handlePurchase = async () => {
    if (!trip) return;

    setPurchasing(true);
    try {
      await ticketService.buyTicket({
        tripId: trip.id,
        carTypeId: selectedCarType?.id,
      });

      Alert.alert(
        'Sucesso!',
        'Ticket comprado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              onClose();
              if (onSuccess) {
                onSuccess();
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Não foi possível comprar o ticket.');
    } finally {
      setPurchasing(false);
    }
  };

  if (!trip) return null;

  const { date, time } = formatDateTime(trip.tripDate);
  const tripPrice = trip.price;
  const carCost = selectedCarType?.cost || 0;
  const total = calculateTotal();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Comprar Passagem</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Card com informações da viagem */}
            <View style={styles.tripCard}>
              <View style={styles.tripInfoRow}>
                <View style={styles.tripInfoItem}>
                  <Text style={styles.tripInfoLabel}>Partida</Text>
                  <Text style={styles.tripInfoValue}>{trip.from}</Text>
                </View>
                <View style={styles.tripInfoItem}>
                  <Text style={styles.tripInfoLabel}>Chegada</Text>
                  <Text style={styles.tripInfoValue}>{trip.to}</Text>
                </View>
              </View>
              <View style={styles.tripInfoRow}>
                <View style={styles.tripInfoItem}>
                  <Text style={styles.tripInfoLabel}>Data</Text>
                  <Text style={styles.tripInfoValue}>{date}</Text>
                </View>
                <View style={styles.tripInfoItem}>
                  <Text style={styles.tripInfoLabel}>Horário</Text>
                  <Text style={styles.tripInfoValue}>{time}</Text>
                </View>
              </View>
            </View>

            {/* Seleção de tipo de passagem */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de Passagem</Text>

              {/* Opção: Apenas passageiro */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  !selectedCarType && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedCarType(null)}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>Passageiro</Text>
                    <Text style={styles.optionSubtitle}>Apenas passagem de passageiro</Text>
                  </View>
                  <View style={styles.radioButton}>
                    {!selectedCarType && <View style={styles.radioButtonInner} />}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Opções: Tipos de carro */}
              {loadingCarTypes ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#155DFC" />
                  <Text style={styles.loadingText}>Carregando tipos de veículo...</Text>
                </View>
              ) : (
                carTypes.map((carType) => (
                  <TouchableOpacity
                    key={carType.id}
                    style={[
                      styles.optionCard,
                      selectedCarType?.id === carType.id && styles.optionCardSelected,
                    ]}
                    onPress={() => setSelectedCarType(carType)}
                  >
                    <View style={styles.optionContent}>
                      <View style={styles.optionInfo}>
                        <Text style={styles.optionTitle}>{carType.carType}</Text>
                        <Text style={styles.optionSubtitle}>
                          Espaço: {carType.space} | Custo adicional: R$ {carType.cost.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.radioButton}>
                        {selectedCarType?.id === carType.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {/* Resumo de preços */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Preço da viagem:</Text>
                <Text style={styles.priceValue}>R$ {tripPrice.toFixed(2)}</Text>
              </View>
              {selectedCarType && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Custo adicional ({selectedCarType.carType}):</Text>
                  <Text style={styles.priceValue}>R$ {carCost.toFixed(2)}</Text>
                </View>
              )}
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Botão de comprar */}
            <TouchableOpacity
              style={[styles.buyButton, purchasing && styles.buyButtonDisabled]}
              onPress={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buyButtonText}>Comprar</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    width: '100%',
  },
  header: {
    backgroundColor: '#155DFC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContent: {
    padding: 20,
  },
  tripCard: {
    backgroundColor: '#BEDBFF',
    borderWidth: 1,
    borderColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tripInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripInfoItem: {
    flex: 1,
  },
  tripInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tripInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  optionCard: {
    backgroundColor: '#F9F9F9',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  optionCardSelected: {
    borderColor: '#155DFC',
    backgroundColor: '#EFF6FF',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#155DFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#155DFC',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  priceSection: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155DFC',
  },
  buyButton: {
    backgroundColor: '#155DFC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

