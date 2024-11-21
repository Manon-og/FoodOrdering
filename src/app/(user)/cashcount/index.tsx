import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import {
  useAllLocalBranchData,
  useInsertCashCount,
  useInsertPendingProducts,
  useSalesTransaction,
} from "@/src/api/products";
import Button from "@/src/components/Button";
import { useBranchStore } from "@/store/branch";
import { useUUIDStore } from "@/store/user";
import { useRouter } from "expo-router";
import ReturnProducts from "@/components/ReturnProducts";
import { v4 as uuidv4 } from "uuid";
import uuid from "react-native-uuid";

const EndDay = () => {
  const router = useRouter();
  const numbers = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
  const [inputValues, setInputValues] = useState<number[]>(
    Array(numbers.length).fill(0)
  );
  const [showReturnProducts, setShowReturnProducts] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [cashCountTotal, setCashCountTotal] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const { id } = useUUIDStore();
  const { id_branch, branchName } = useBranchStore();
  const { data: returnProducts } = useAllLocalBranchData(id_branch ?? "");
  const { data: totalTransactionsData } = useSalesTransaction();

  const transactionId = uuid.v4();
  console.log("Transaction ID:", transactionId);
  const insertPendingProducts = useInsertPendingProducts();
  const mutation = useInsertCashCount();

  const handleInputChange = (value: string, index: number) => {
    const newValues = [...inputValues];
    newValues[index] = parseFloat(value) || 0;
    setInputValues(newValues);
  };

  const total = inputValues.reduce(
    (acc, curr, index) => acc + curr * numbers[index],
    0
  );

  const handleSubmitCashCount = () => {
    const data = {
      id_branch,
      id_user: id,
      total,
      one: inputValues[0],
      five: inputValues[1],
      ten: inputValues[2],
      twenty: inputValues[3],
      fifty: inputValues[4],
      hundred: inputValues[5],
      two_hundred: inputValues[6],
      five_hundred: inputValues[7],
      thousand: inputValues[8],
    };

    mutation.mutate(data, {
      onSuccess: () => {
        setInputValues(Array(numbers.length).fill(0));
        setCashCountTotal(total);
        setShowReturnProducts(true);

        // Set the total sales value to be shown in the modal (from system data)
        setTotalSales(
          totalTransactionsData?.reduce(
            (acc, transaction) => acc + transaction.amount,
            0
          ) || 0
        );
      },
    });
  };

  const handleInsertPendingProducts = () => {
    insertPendingProducts.mutate(
      {
        id_branch: Number(id_branch),
        id_user: id?.toString() ?? "",
        id_group: transactionId,
      },
      {
        onSuccess: (data) => {
          console.log("Inserted IDs:", data);
          Alert.alert("Success", "Request for return products sent");

          // Show the final modal after returning products
          setShowFinalModal(true);
        },
        onError: (error) => {
          console.error("Error inserting pending products:", error);
        },
      }
    );
  };

  const confirmSubmitCashCount = () => {
    Alert.alert(
      "Confirmation",
      `Are you sure you want to submit the Cash Count?\n\nThe total is ₱${total.toLocaleString()}.\n\n⚠️ WARNING: This cannot be changed later on. Please double-check before submitting.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: handleSubmitCashCount,
        },
      ]
    );
  };

  const confirmReturnProducts = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to return the products?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: handleInsertPendingProducts,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {!showReturnProducts ? (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>Cash Count</Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.statusHeader]}>
              Peso Bill
            </Text>
            <Text style={[styles.headerText, styles.moreInfoHeader]}>
              Number of Bills
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {numbers.map((number, index) => (
              <View key={number} style={styles.itemContainer}>
                <Text style={styles.itemLeft}>₱ {number}</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter"
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange(value, index)}
                  value={inputValues[index].toString()}
                />
              </View>
            ))}
          </ScrollView>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>TOTAL</Text>
            <Text style={styles.totalValue}>₱ {total}</Text>
          </View>
          <Button
            text={"Confirm"}
            onPress={confirmSubmitCashCount}
            style={styles.confirmBtn}
          />
        </>
      ) : (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>Return Products</Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.statusHeader]}>
              Products
            </Text>
            <Text style={[styles.headerText, styles.moreInfoHeader]}>
              Total Quantity
            </Text>
          </View>
          <FlatList
            data={returnProducts}
            keyExtractor={(item: any) => item.id_products.toString()}
            renderItem={({ item }: any) => (
              <ReturnProducts name={item.name} quantity={item.quantity} />
            )}
          />
          <Button text={"Return"} onPress={confirmReturnProducts} />
        </>
      )}

      {/* Modal to show the final summary */}
      <Modal visible={showFinalModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>End of Day Summary</Text>
            <Text style={styles.modalText}>
              Cash Count Total: ₱{cashCountTotal.toLocaleString()}
            </Text>
            <Text style={styles.modalText}>
              Total Sales: ₱{totalSales.toLocaleString()}
            </Text>
            <Button
              text={"Close"}
              onPress={() => router.push("/(user)/profile")}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: "20%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    width: "100%",
  },
  dateContainer: {
    position: "absolute",
    top: 25,
  },
  dayText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0E1432",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: 10,
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
    paddingLeft: 20,
    flex: 1,
  },
  moreInfoHeader: {
    fontSize: 15,
    paddingRight: 20,
    textAlign: "right",
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  itemLeft: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  inputBox: {
    fontSize: 16,
    width: 100,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    padding: 5,
  },
  totalContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  totalText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0078D4",
  },
  confirmBtn: {
    width: "100%",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default EndDay;
