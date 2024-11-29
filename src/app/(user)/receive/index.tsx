import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  useBranchData,
  useGetPendingProducts,
  useLocalBranchData,
  useInsertReceivePendingStocks,
  useGetReceivePendingStocks,
} from "@/src/api/products";

import GroupedReturnedItem from "@/components/AdminReturnReturnedProducts";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useBranchName } from "@/components/branchParams";
import StaffViewPendingProducts from "@/components/StaffViewPendingProducts";
import Button from "@/components/Button";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();

  const { id_branch, branchName } = useBranchName();
  console.log("asdxzc:", id_branch);

  const receiveStocks = useInsertReceivePendingStocks();
  const { data: viewPendingProducts } = useGetReceivePendingStocks(id_branch);
  console.log("viewPendingProducts:", viewPendingProducts);

  console.log("Branch data:", branch);
  console.log("Local branch data:", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: pendingProducts } = useGetPendingProducts();
  console.log("Pending products??:", pendingProducts);

  const renderItem = ({ item }: { item: any }) => {
    const createdAtDate = item.created_at.split("T")[0];
    console.log("IDBRNch:", item.id_branch.id_branch);
    return (
      <StaffViewPendingProducts
        name={item.id_products.name}
        quantity={item.quantity}
      />
    );
  };

  const router = useRouter();
  const handleAcceptPress = () => {
    receiveStocks.mutate(id_branch);
    router.push(
      `/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`
    );
    Alert.alert("Accepted", "You have accepted the pending products.");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Pending Stocks",
        }}
      />

      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Qty</Text>
      </View>
      <FlatList
        data={viewPendingProducts}
        renderItem={renderItem}
        // keyExtractor={(item) => item.returned_groupID} pede bani??
      />
      <TouchableOpacity style={styles.button} onPress={handleAcceptPress}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFD895",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 17,
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // paddingTop: "20%",
  },
  dateContainer: {
    position: "absolute",
    top: "2.5%",
  },
  dateText: {
    fontSize: 20,
    color: "gray",
    textAlign: "center",
  },
  dayText: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0E1432",
    textAlign: "center",
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
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  statusHeader: {
    textAlign: "left",
    flex: 0.5,
    paddingLeft: "5%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
    paddingRight: 20,
  },
});

export default Index;
