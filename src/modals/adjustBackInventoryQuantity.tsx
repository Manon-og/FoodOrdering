import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import GroupedVoidSalesTransactionItem from "@/components/AdminGroupedVoidSalesTransactionItem";
import Colors from "@/constants/Colors";
import AdminOverViewDetails from "@/components/AdminOverViewDetails";
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
  const availableQuantity = quantity;
  console.log("DATA FAUCUJCKCK:", Data);

  const updateQuantityPerLocation = useUpdateBatchQuantity();

  console.log("DATA IDPRODUCT:", MainData.id_products);
  console.log("DATA FAUCUJCKCK:", MainData.batch);
  console.log("DATA FAUCUJCKCK:", MainData.confirmedProductsId);
  console.log("DATA FAUCUJCKCK:", MainData.pendingLocalBatchId);
  console.log("DATA LOCATION:", Location);

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
    updateQuantityPerLocation.mutate({
      id: id,
      location: Location,
      quantityLoss: Number(quantity),
      originalQuantity: Number(originalQuantity),
      id_products: MainData.id_products,
    });
    setIsConfirmed(true);
    setModalVisible(false);
  };

  const handleQuantityChange = (text: string) => {
    const numericValue = parseInt(text, 0);
    const availableQuantity = parseInt(Data, 0);
    if (!isNaN(numericValue) && numericValue <= availableQuantity) {
      setQuantity(text);
    } else if (text === "" || text === "0") {
      setQuantity(text);
    } else {
      Alert.alert(
        "Invalid Input",
        `Quantity cannot be more than ${availableQuantity}`
      );
    }
  };

  useEffect(() => {
    if (Data) {
      setQuantity(Data.toString());
      setOriginalQuantity(Data.toString());
    }
  }, [Data, modalVisible]);

  console.log("QUANTITYYYY+:", quantity);
  console.log("QUANTITYYYY", originalQuantity);

  const renderPlaceItem = ({ item }: { item: any }) => {
    return (
      <AdminOverViewDetails
        places={[item.place]}
        totalQuantity={item.quantity}
      />
    );
  };

  const handleClose = () => {
    if (isConfirmed === false) {
      setQuantity(originalQuantity);
    } else {
      setQuantity(quantity);
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
            // value={quantity}
            onChangeText={handleQuantityChange}
            placeholder="99.9"
            style={styles.input}
            keyboardType="numeric"
          />

          {/* <FlatList
            data={Data}
            keyExtractor={(item) => item.id_products.toString()}
            renderItem={renderVoidedItem}
          /> */}

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
    marginTop: 5,
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

export default AdjustBackInventoryQuantity;
