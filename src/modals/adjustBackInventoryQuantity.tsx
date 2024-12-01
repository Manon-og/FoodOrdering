import React, { useEffect, useState } from "react";
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
import { useUpdateBatchQuantity } from "@/api/products";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  Data: any;
  Location: string;
  MainData: any;
};

const AdjustBackInventoryQuantity = ({
  modalVisible,
  setModalVisible,
  Data,
  Location,
  MainData,
}: VoidedTransactionModalProps) => {
  const [quantity, setQuantity] = useState("");
  const [originalQuantity, setOriginalQuantity] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const updateQuantityPerLocation = useUpdateBatchQuantity();

  let id = "";
  if (typeof MainData.batch !== "object") {
    id = MainData.batch;
  }
  if (MainData.confirmedProductsId !== null) {
    id = MainData.confirmedProductsId;
  }
  if (MainData.pendingLocalBatchId !== null) {
    id = MainData.pendingLocalBatchId;
  }

  const handlePress = () => {
    const numericValue = parseInt(quantity, 10);
    const availableQuantity = parseInt(Data, 10);

    if (!numericValue || numericValue <= 0 || numericValue > availableQuantity) {
      Alert.alert(
        "Invalid Input",
        `Please enter a valid quantity between 1 and ${availableQuantity}.`
      );
      return;
    }

    Alert.alert(
      "Confirmation",
      `Are you sure you want to dispose ${numericValue}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            updateQuantityPerLocation.mutate({
              id: id,
              location: Location,
              quantityLoss: numericValue,
              originalQuantity: Number(originalQuantity),
              id_products: MainData.id_products,
            });
            setIsConfirmed(true);
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const handleQuantityChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setQuantity(numericValue);
  };

  useEffect(() => {
    if (Data) {
      setOriginalQuantity(Data.toString());
    }
  }, [Data, modalVisible]);

  const handleClose = () => {
    if (!isConfirmed) {
      setQuantity(originalQuantity);
    }
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
              Expired/Lost Qty
            </Text>
          </View>

          <TextInput
            value={quantity}
            onChangeText={handleQuantityChange}
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            autoFocus={true}
          />

          <View style={styles.buttonRow}>
          <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handlePress}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
          </View>
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
    backgroundColor: Colors.light.tint,
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
    backgroundColor: "#0E1432",
  },
  buttonCancel: {
    backgroundColor: "#0E1432",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  totalSalesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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

export default AdjustBackInventoryQuantity;