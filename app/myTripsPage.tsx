import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { TicketResponse } from "@/services/types";
import { ticketService } from "@/services/ticketService";
import CheckInModal from "@/components/CheckInModal";

export default function MyTripsPage() {
  const router = useRouter();

  const [myTickets, setMyTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [checkinModalVisible, setCheckinModalVisible] = useState(false);


  const fetchMyTickets = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const tickets = await ticketService.getMyTickets();
      setMyTickets(tickets);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tickets.");
    } finally {
      setLoading(false);
    }
  };

  const formatTicket = (ticket: TicketResponse) => {
    const date = new Date(ticket.tripDate);
    const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  
    return {
      id: ticket.tripId,
      from: ticket.tripFrom,
      to: ticket.tripTo,
      time: time
    };
  };
  
  useEffect(() => {
    fetchMyTickets();
  }, []);


  const renderTrip = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>Partida</Text>
        <Text style={styles.value}>{item.from}</Text>

        <Text style={[styles.label, { marginTop: 10 }]}>Destino</Text>
        <Text style={styles.value}>{item.to}</Text>

        <Text style={[styles.label, { marginTop: 10 }]}>Horário</Text>
        <Text style={styles.value}>{item.time}</Text>
      </View>

      <TouchableOpacity 
        style={styles.checkinButton}
        onPress={() => {
          setSelectedTicket(item);
          setCheckinModalVisible(true);
        }}
      >
        <Text style={styles.checkinText}>Check-in</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* BOTÃO DE VOLTAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#155DFC" />
      </TouchableOpacity>

      <Header
        title="Suas viagens"
        subtitle="Seu histórico de viagens"
      />

      
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
            onPress={fetchMyTickets}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : myTickets.length === 0 ? (
        <View style={{padding: 40, alignItems: 'center', justifyContent: 'center',}}>
          <Text style={{marginTop: 10,color: '#666',fontSize: 14,}}>Nenhum ticket comprado</Text>
        </View>
      ) : (
        <FlatList
          data={myTickets.map(formatTicket)}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          contentContainerStyle={{ paddingBottom: 30 }}
          style={{ marginTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <CheckInModal
        visible={checkinModalVisible}
        onClose={() => setCheckinModalVisible(false)}
        ticket={selectedTicket}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  backButton: {
    padding: 15,
    marginTop: 10,
    width: 60,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,

    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
  },

  value: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },

  checkinButton: {
    backgroundColor: "#155DFC",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  checkinText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
