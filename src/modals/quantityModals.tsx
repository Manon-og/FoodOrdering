import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";

interface QuantityModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  inputQuantity: string;
  setInputQuantity: (text: string) => void;
  name: string;
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  visible,
  onClose,
  onConfirm,
  inputQuantity,
  setInputQuantity,
  name,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalProduct}> {name}</Text>
          <Text style={styles.modalTitle}>Enter Quantity to Stock in</Text>
          <TextInput
            style={styles.input}
            value={inputQuantity}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, ""); // Only allow numbers
              setInputQuantity(numericValue);
            }}
            placeholder="99"
            keyboardType="numeric"
            maxLength={5}
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Confirm" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    width: "33%",
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalProduct: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default QuantityModal;
