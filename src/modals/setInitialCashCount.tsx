import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";

import Colors from "@/constants/Colors";

import { useInsertInitialCashBalance } from "@/api/products";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id_branch: string | string[];
};

const SetInitialCashBalance = ({
  modalVisible,
  setModalVisible,
  id_branch,
}: VoidedTransactionModalProps) => {
  const [cash, setCash] = useState(0);
  const insertInitialCashBalance = useInsertInitialCashBalance();

  const handlePress = () => {
    insertInitialCashBalance.mutate({
      id_branch: id_branch,
      cash: cash,
    });
    Alert.alert("Initial Cash Balance Set");
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Pressable style={styles.modalContainer} onPress={handleClose}>
        <Pressable style={styles.modalView} onPress={() => {}}>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.statusMiddle]}>
              Initial Cash Balance
            </Text>
          </View>

          <TextInput
            value={cash.toString()}
            onChangeText={(text) => setCash(Number(text))}
            placeholder="99.9"
            style={styles.input}
            keyboardType="numeric"
          />

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={handlePress}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(211, 211, 211, .6)",
    padding: 10,
    width: "50%",
    borderRadius: 5,
    marginTop: "5%",
    marginBottom: 20,
    textAlign: "center",
  },
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
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "#0E1432",
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  statusHeader: {
    fontSize: 15,
    textAlign: "left",
    flex: 1,
    paddingLeft: 10,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
  },
  button: {
    color: "#FFD895",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  totalSalesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // paddingHorizontal: 20,
    marginBottom: 40,
  },
  totalSalesText: {
    paddingTop: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    paddingRight: 10,
  },
  totalSalesNumber: {
    paddingTop: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    paddingRight: 25,
  },
});

export default SetInitialCashBalance;
