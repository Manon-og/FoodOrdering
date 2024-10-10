import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Stack } from 'expo-router';

const BranchOptionsModal = ({ visible, onClose, branches = [], onSelectBranch, branchName }: any) => {
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
              {/* <Stack.Screen
                options={{
                  title: branchName || 'Back Inventory',
                }}
              /> */}
              {branches.map((branch: any) => (
                <Pressable
                  key={branch.id_branch}
                  style={styles.option}
                  onPress={() => {
                  onSelectBranch(branch.id_branch, branch.place);
                  onClose();
                  }}  
                >
                  <Text style={styles.textStyle}>{branch.place}</Text>
                </Pressable>
              ))}
              <Pressable style={[styles.button, styles.buttonClose]}>
                <Text style={styles.textStyle}> + </Text>
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
    paddingLeft: 50,
    paddingRight: 50,
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
    borderRadius: 40,
    paddingLeft: 30,
    paddingRight: 30,
    elevation: 100,
  },
  buttonClose: {
    backgroundColor: 'lightblue',
  },
  option: {
    padding: 10,
    marginVertical: 5,
  },
  textStyle: {
    fontSize: 18,
    padding: 5,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BranchOptionsModal;