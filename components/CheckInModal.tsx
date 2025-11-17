import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg"; 

interface CheckInModalProps {
  visible: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    from: string;
    to: string;
    time: string;
  } | null;
}

export default function CheckInModal({ visible, onClose, ticket }: CheckInModalProps) {
  if (!ticket) return null;

  const qrData = `ticket:${ticket.id}|from:${ticket.from}|to:${ticket.to}|time:${ticket.time}`;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>

          <Text style={styles.title}>Check-in da Viagem</Text>

          {/* QR CODE */}
          <View style={styles.qrContainer}>
            <QRCode value={qrData} size={180} />
          </View>

          {/* INFO */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Origem</Text>
            <Text style={styles.value}>{ticket.from}</Text>

            <Text style={styles.label}>Destino</Text>
            <Text style={styles.value}>{ticket.to}</Text>

            <Text style={styles.label}>Horário</Text>
            <Text style={styles.value}>{ticket.time}</Text>
          </View>

          {/* BOTÃO FECHAR */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#155DFC",
  },
  qrContainer: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 2,
  },
  infoBox: {
    width: "100%",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: "#777",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#155DFC",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
