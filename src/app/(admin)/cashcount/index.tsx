import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import {
  useAllLocalBranchData,
  useGetCashCount,
  useInsertCashCount,
} from "@/src/api/products";
import ReturnProducts from "@/components/ReturnProducts";
import Button from "@/src/components/Button";
import { useBranchStore } from "@/store/branch";
import { useUUIDStore } from "@/store/user";
import { useRouter } from "expo-router";
import { useBranchStoreAdmin } from "@/store/branchAdmin";

const Index = () => {
  const router = useRouter();
  // const renderItem = ({ item }: { item: any }) => {
  //   return <ReturnProducts name={item.name} quantity={item.quantity} />;
  // };
  const numbers = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
  const [inputValues, setInputValues] = useState<number[]>(
    Array(numbers.length).fill(0)
  );

  const handleInputChange = (value: string, index: number) => {
    const newValues = [...inputValues];
    newValues[index] = parseFloat(value) || 0;
    setInputValues(newValues);
  };

  const total = inputValues.reduce(
    (acc, curr, index) => acc + curr * numbers[index],
    0
  );

  const mutation = useInsertCashCount();

  const handleSubmit = () => {
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
        router.push("/(user)/profile");
      },
    });
  };

  const { id } = useUUIDStore();
  console.log("CASHCOUNT:", id);

  const { id_branch, branchName } = useBranchStoreAdmin();
  console.log("CASHCOUNT:", id_branch);
  console.log("CASHCOUNT:", branchName);

  const { data: cashcount } = useGetCashCount(
    id_branch ? id_branch.toString() : ""
  );
  console.log("ADMIN CASHCOUNT", cashcount);
  const cashCountData = cashcount && cashcount.length > 0 ? cashcount[0] : {};

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>Cash Count</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Peso Bill</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Number of Bills
        </Text>
      </View>
      {numbers.map((number, index) => (
        <View key={number} style={styles.itemContainer}>
          <Text style={styles.itemLeft}>₱ {number}</Text>
          <Text style={styles.itemRight}>
            {number === 1000
              ? cashCountData.thousand
              : number === 500
              ? cashCountData.five_hundred
              : number === 200
              ? cashCountData.two_hundred
              : number === 100
              ? cashCountData.hundred
              : number === 50
              ? cashCountData.fifty
              : number === 20
              ? cashCountData.twenty
              : number === 10
              ? cashCountData.ten
              : number === 5
              ? cashCountData.five
              : number === 1
              ? cashCountData.one
              : 0}
          </Text>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>TOTAL</Text>
        <Text style={styles.totalValue}>₱ {cashCountData.total}</Text>
      </View>
      {/* <Button text={"Confirm"} onPress={confirmSubmit} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: "30%",
  },
  dateContainer: {
    position: "absolute",
    top: 50,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    paddingLeft: 13,
  },
  dayText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "green",
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
    paddingLeft: 20,
    flex: 1,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemLeft: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 37,
  },
  inputBox: {
    paddingRight: 37,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    textAlign: "left",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 20,
    color: "green",
    textAlign: "right",
  },
});

export default Index;
