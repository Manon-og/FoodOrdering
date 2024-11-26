import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useGetProductionHistory,
  useGetRealProductionHistoryDetails,
  useGroupedSalesTransaction,
  useGroupedSalesTransactionADMIN,
  useReturnedProductHistory,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import AdminViewTransaction from "@/components/AdminViewTransaction";
import DropdownComponent from "@/components/DropDown";
import AdminViewProduction from "@/components/AdminViewProduction";
import AdminViewProductionDetails from "@/components/AdminViewProductionDetails";
import AdminViewRealProductionDetails from "@/components/AdminViewRealProductionDetails";
import AdminReturnReturnedProductsHistory from "@/components/AdminViewReturnedProductsHistory";

const Index = () => {
  const filter = [
    { label: "Sales", value: "Sales" },
    { label: "Product Transfer", value: "Product Transfer" },
    { label: "Expired Products", value: "Expired Products" },
    { label: "Production", value: "Production" },
    { label: "Returned Products", value: "Returned Products" },
  ];

  const location = "Back Inventory";
  const date = new Date().toISOString().split("T")[0];
  const { data: production } = useGetRealProductionHistoryDetails(
    location,
    date
  );

  console.log("Production History Details?:", production);

  const { data: returnedHistory } = useReturnedProductHistory();
  console.log("Returned History!:", returnedHistory);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminReturnReturnedProductsHistory
        from={item.from}
        to={item.to}
        quantity={item.quantity}
        date={item.created_at}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent data={filter} />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>From</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>To</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Date</Text>
      </View>
      <FlatList
        data={returnedHistory}
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
    paddingLeft: "10%",
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
    paddingRight: "8%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
    paddingRight: "13%",
  },
});

export default Index;
