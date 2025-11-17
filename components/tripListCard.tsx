import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trip } from "../services/types";

interface TripsListCardProps {
  title: string;
  trips: Trip[];
  onBuyPress?: (trip: Trip) => void;
}

export default function TripsListCard({ title, trips, onBuyPress }: TripsListCardProps) {
  // Função para formatar a data/hora para exibir apenas o horário
  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      return '--:--';
    }
  };

  if (!trips || trips.length === 0) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.header}>
          <Ionicons name="time-outline" size={22} color="#155DFC" style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma viagem disponível para hoje</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Ionicons name="time-outline" size={22} color="#155DFC" style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </View>
    
      {trips.map((trip) => (
        <View key={trip.id} style={styles.viagemCard}>
          <View>
            <Text style={styles.horario}>{formatTime(trip.tripDate)}</Text>
            <Text style={styles.trajeto}>{trip.from} → {trip.to}</Text>
            <Text style={styles.price}>R$ {trip.price.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.botaoComprar}
            onPress={() => onBuyPress && onBuyPress(trip)}
          >
            <Text style={styles.botaoTexto}>Comprar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  viagemCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  horario: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  trajeto: {
    fontSize: 14,
    color: "#666",
  },
  botaoComprar: {
    backgroundColor: "#155DFC",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  price: {
    fontSize: 12,
    color: "#155DFC",
    fontWeight: "600",
    marginTop: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});