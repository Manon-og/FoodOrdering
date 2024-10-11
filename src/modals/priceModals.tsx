import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';

const PriceHistoryModal = ({ visible, onClose, priceHistory = [] }: any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Price History</Text>
              {priceHistory.length > 0 ? (
                <FlatList
                  data={priceHistory}
                  keyExtractor={(item) => item.id_pricehistory}
                  renderItem={({ item }) => (
                    <View style={styles.priceHistoryItem}>
                      <Text>{item.created_at}: ₱{item.id_price.amount}.00</Text>
                    </View>
                  )}
                />
              ) : (
                <Text>No price history available.</Text>
              )}
              <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'lightblue',
    marginTop: 15,
  },
  priceHistoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  textStyle: {
    fontSize: 18,
    padding: 5,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default PriceHistoryModal;