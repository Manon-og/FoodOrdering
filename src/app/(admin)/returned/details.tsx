import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useBranchData,
  useGetPendingProducts,
  useGetPendingProductsDetails,
  useLocalBranchData,
} from "@/src/api/products";
import ListItem from "@/src/components/listItem";
import { Link } from "expo-router";
import Button from "@/src/components/Button";
import GroupedReturnedItem from "@/components/AdminReturnReturnedProducts";
import GroupedReturnedItemDetails from "@/components/AdminReturnReturnedProductDetails";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();

  console.log("Branch data:", branch);
  console.log("Local branch data:", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: pendingProductsDetails } = useGetPendingProductsDetails();
  console.log("Pending pr:", pendingProductsDetails);

  const renderItem = ({ item }: { item: any }) => {
    const createdAtDate = item.created_at.split("T")[0];
    return (
      <GroupedReturnedItemDetails
        id_products={item.id_products.name}
        quantity={item.quantity}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Products</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Quantity</Text>
      </View>
      <FlatList
        data={pendingProductsDetails}
        renderItem={renderItem}
        // keyExtractor={(item) => item.created_at} pede bani??
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dateContainer: {
    position: "absolute",
    top: 50,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
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
    textAlign: "left",
    flex: 0.5,
    paddingLeft: 20,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
    paddingRight: 10,
  },
});

export default Index;
