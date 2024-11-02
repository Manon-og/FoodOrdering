import React from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Modal } from "react-native";
import Button from "@/src/components/Button"; // Adjust the import path accordingly

type RestockModalProps = {
  visible: boolean;
  lowStockItems: any[];
  allItems: any[];
  restockQuantities: { [key: string]: number };
  onQuantityChange: (id_products: string, quantity: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const RestockModal: React.FC<RestockModalProps> = ({
  visible,
  lowStockItems,
  allItems,
  restockQuantities,
  onQuantityChange,
  onCancel,
  onConfirm,
}) => {
  const itemsToDisplay = lowStockItems.length > 0 ? lowStockItems : allItems;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {lowStockItems.length > 0 ? "Restock Low Stock Items" : "Current Stock Levels"}
          </Text>
          <FlatList
            data={itemsToDisplay}
            renderItem={({ item }) => (
              <View style={styles.modalItem}>
                <Text style={styles.modalItemText}>{item.name}</Text>
                <Text style={styles.modalItemText}>Current: {item.quantity}</Text>
                <Text style={styles.modalItemText}>Available: {item.backInventoryQuantity}</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={restockQuantities[item.id_products]?.toString() || ""}
                  onChangeText={(text) => onQuantityChange(item.id_products, text)}
                />
              </View>
            )}
            keyExtractor={(item) => item.id_products.toString()}
          />
          <View style={styles.modalButtons}>
            <Button text="Cancel" onPress={onCancel} />
            <Button text="Confirm" onPress={onConfirm} />
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalItemText: {
    fontSize: 16,
    flex: 1,
  },
  modalInput: {
    borderBottomWidth: 1,
    width: 60,
    textAlign: "center",
    padding: 5,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default RestockModal;