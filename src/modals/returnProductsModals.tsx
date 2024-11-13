import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const ReturnBranchOptionsModal = ({
  visible,
  onClose,
  branches = [],
  onSelectBranch,
  branchName,
}: any) => {
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
              <Text style={styles.titleText}>
                Choose a location to transfer
              </Text>
              {branches.map((branch: any) => (
                <Pressable
                  key={branch.id_branch}
                  style={styles.option}
                  onPress={() => {
                    onSelectBranch(branch.id_branch, branch.place);
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>{branch.place}</Text>
                </Pressable>
              ))}
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  option: {
    padding: 10,
    marginVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
});

export default ReturnBranchOptionsModal;
