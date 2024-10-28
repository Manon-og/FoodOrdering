import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import Colors from '../constants/Colors';

type CartModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  currentQuantity: number;
};

const CartModal = ({ visible, onClose, onConfirm, currentQuantity }: CartModalProps) => {
  const [inputQuantity, setInputQuantity] = useState(currentQuantity.toString());

  const handleConfirm = () => {
    const newQuantity = parseInt(inputQuantity, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      Alert.alert('Invalid Input', 'Please enter a quantity greater than 0.');
    } else {
      onConfirm(newQuantity);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={inputQuantity}
            onChangeText={setInputQuantity}
            placeholder="Enter quantity"
          />
          <View style={styles.modalButtons}>
            <Pressable style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: Colors.light.tint,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CartModal;
