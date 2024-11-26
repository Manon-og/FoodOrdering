import React from "react";
import { View, Text, StyleSheet, Modal, Pressable } from "react-native";
import Colors from "@/constants/Colors";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  comment: any;
};

const ViewCommentModal = ({
  modalVisible,
  setModalVisible,
  comment,
}: VoidedTransactionModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <Pressable
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.dayText}>Comment</Text>
            <Text style={styles.dayText2}>{comment}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(211, 211, 211, .6)",
    marginTop: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dayText: {
    fontSize: 17,
    paddingLeft: 13,
    color: "#0E1432",
    paddingBottom: 10,
    fontWeight: "bold",
  },
  dayText2: {
    fontSize: 15,
    paddingLeft: 13,
    color: "#0E1432",
    paddingBottom: 30,
  },
  button: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});

export default ViewCommentModal;
