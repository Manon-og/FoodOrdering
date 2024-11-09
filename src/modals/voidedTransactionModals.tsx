import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import GroupedVoidSalesTransactionItem from "@/components/AdminGroupedVoidSalesTransactionItem";
import Colors from "@/constants/Colors";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  voidData: any[];
  totalVoidedSales: number;
  currentDate: string;
  currentDay: string;
};

const VoidedTransactionModal = ({
  modalVisible,
  setModalVisible,
  voidData,
  totalVoidedSales,
  currentDate,
  currentDay,
}: VoidedTransactionModalProps) => {
  const renderVoidedItem = ({ item }: { item: any }) => {
    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    if (createdAtDate !== currentDate) {
      return null;
    }

    return (
      <GroupedVoidSalesTransactionItem
        id_products={item.id_products.name}
        quantity={item.quantity}
        amount_by_product={item.amount_by_product}
        transactions={item.transactions}
      />
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.dayText}>Voided Transaction</Text>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.statusHeader]}>
              Product Name
            </Text>
            <Text style={[styles.headerText, styles.statusMiddle]}>
              Total Quantity
            </Text>
            <Text style={[styles.headerText, styles.moreInfoHeader]}>
              Total Amount
            </Text>
          </View>
          <FlatList
            data={voidData}
            keyExtractor={(item) => item.id_products.id_products.toString()}
            renderItem={renderVoidedItem}
          />

          <View style={styles.totalSalesContainer}>
            <Text style={styles.totalSalesText}> Total Voided Sales:</Text>
            <Text style={styles.totalSalesNumber}>₱{totalVoidedSales}</Text>
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
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
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "green",
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
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  totalSalesText: {
    paddingTop: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "darkred",
  },
  totalSalesNumber: {
    paddingTop: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "darkred",
  },
});

export default VoidedTransactionModal;
