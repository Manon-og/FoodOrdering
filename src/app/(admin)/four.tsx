import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useGetProductionHistory,
  useGetRealProductionHistoryDetails,
  useGroupedSalesTransaction,
  useGroupedSalesTransactionADMIN,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import AdminViewTransaction from "@/components/AdminViewTransaction";
import DropdownComponent from "@/components/DropDown";
import AdminViewProduction from "@/components/AdminViewProduction";
import AdminViewProductionDetails from "@/components/AdminViewProductionDetails";
import AdminViewRealProductionDetails from "@/components/AdminViewRealProductionDetails";

const Index = () => {
  const filter = [
    { label: "Sales Transaction", value: "Sales Transaction" },
    { label: "Transfer Transaction", value: "Transfer Transaction" },
    { label: "Expired Transaction", value: "Expired Transaction" },
    { label: "Production Transaction", value: "Production Transaction" },
  ];
  //   const { id_branch, branchName } = useBranchStoreAdmin();
  //   console.log("ADMIN TRANSACTION:", id_branch);
  //   console.log("ADMIN TRANSACTION:", branchName);
  //   const currentDate = new Date().toLocaleDateString();
  //   const currentDay = new Date().toLocaleDateString("en-US", {
  //     weekday: "long",
  //   });
  const location = "Back Inventory";
  const date = new Date().toISOString().split("T")[0];
  const { data: production } = useGetRealProductionHistoryDetails(
    location,
    date
  );

  console.log("Production History Details?:", production);

  const renderItem = ({ item }: { item: any }) => {
    const date = new Date(item.created_at).toISOString().split("T")[0];
    return (
      <AdminViewRealProductionDetails
        name={item.id_products.name}
        quantity={item.quantity}
        date={date}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent data={filter} />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>
          Product Name{" "}
        </Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Date</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Qty</Text>
      </View>
      <FlatList
        data={production}
        // keyExtractor={keyExtractor} hehe
        renderItem={renderItem}
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
    // paddingTop: "20%",
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
    flex: 1,
    paddingLeft: 10,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
    paddingLeft: "10%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
    paddingRight: 20,
  },
});

export default Index;
