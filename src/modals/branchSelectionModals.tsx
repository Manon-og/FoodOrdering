import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';
import { useBatchList } from '@/src/api/products';
import BatchListItem from '@/src/components/batchListItem';

const BranchSelectionModal = ({ visible, onClose, id_products }: { visible: boolean, onClose: () => void, id_products: any }) => {
  console.log('ID Products:', id_products);  // Corrected log statement
  const { data: batches, isLoading, error } = useBatchList(id_products);
  console.log('Batches:', batches);  // Corrected log statement

  if (isLoading) {
    return <Text>Loading..</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const renderItem = ({ item }: { item: any }) => (
    <BatchListItem id_products={item.id_products} />
  );

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
              <FlatList
                data={batches}
                keyExtractor={(item) => item.id_batch.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ gap: 10, padding: 10 }}
              />
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
    marginTop: 22,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  },
  textStyle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BranchSelectionModal;