import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from "react-native";
import { useAllLocalBranchData, useInsertCashCount } from "@/src/api/products";
import Button from "@/src/components/Button";
import { useBranchStore } from "@/store/branch";
import { useUUIDStore } from "@/store/user";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  const numbers = [1, 5, 10, 20, 50, 100, 200, 500, 1000];
  const [inputValues, setInputValues] = useState<number[]>(Array(numbers.length).fill(0));

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
  const { id_branch, branchName } = useBranchStore();
  const { data: returnProducts } = useAllLocalBranchData(id_branch ?? "");

  const confirmSubmit = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to submit the Cash Count?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: handleSubmit,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
          <Text style={styles.dayText}>Cash Count</Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={[styles.headerText, styles.statusHeader]}>Peso Bill</Text>
          <Text style={[styles.headerText, styles.moreInfoHeader]}>Number of Bills</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Loop through numbers and render input fields */}
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
        <Button text={"Confirm"} onPress={confirmSubmit} style={styles.confirmBtn}/>
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
    marginVertical: 0,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 20,
    color: "gray",
    textAlign: "right",
  },
  confirmBtn: {
    height: 10,
    backgroundColor: "#0E1432",
  }
});

export default Index;
