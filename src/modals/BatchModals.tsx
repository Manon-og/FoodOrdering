import React, { useState } from 'react';
import { Modal, View, FlatList, StyleSheet, Pressable, Text, TouchableWithoutFeedback } from 'react-native';
import QuantityBatchListItem from '@/components/QuantityBatchListItem';

const BatchModal = ({ visible, onClose, batch }: any) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheckbox = (id_batch: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id_batch]: !prev[id_batch],
    }));
  };

  const renderItemByBatch = ({ item }: any) => {
    return (
      <QuantityBatchListItem
        batch={item}
        isChecked={!!checkedItems[item.id_batch]}
        onToggleCheckbox={toggleCheckbox}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
              <FlatList
                data={batch}
                keyExtractor={(item) => item.id_batch.toString()}
                renderItem={renderItemByBatch}
                contentContainerStyle={styles.flatListContent}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    width: '80%',
    maxHeight: '80%', // Limit the height of the modal content
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  flatListContent: {
    gap: 10,
    padding: 10,
  },
});

export default BatchModal;