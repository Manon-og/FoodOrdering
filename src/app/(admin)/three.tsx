import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useExpiredProductsHistoru,
  useGetProductionHistory,
  useGroupedSalesTransaction,
  useGroupedSalesTransactionADMIN,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import AdminViewTransaction from "@/components/AdminViewTransaction";
import DropdownComponent from "@/components/DropDown";
import AdminViewProduction from "@/components/AdminViewProduction";
import AdminViewExpiredHistory from "@/components/AdminViewExpiredHistory";

const Index = () => {
  const filter = [
    { label: "Sales", value: "Sales" },
    { label: "Product Transfer", value: "Product Transfer" },
    { label: "Expired Products", value: "Expired Products" },
    { label: "Production", value: "Production" },
    { label: "Returned Products", value: "Returned Products" },
  ];
  //   const { id_branch, branchName } = useBranchStoreAdmin();
  //   console.log("ADMIN TRANSACTION:", id_branch);
  //   console.log("ADMIN TRANSACTION:", branchName);
  //   const currentDate = new Date().toLocaleDateString();
  //   const currentDay = new Date().toLocaleDateString("en-US", {
  //     weekday: "long",
  //   });

  //   const { data: groupedSales }: any = useGroupedSalesTransactionADMIN();
  //   const { data: groupedProduction }: any = useGetProductionHistory();

  const { data: expiredProducts } = useExpiredProductsHistoru();

  //   console.log("GROUPED SALESs:", groupedSales);
  //   console.log("GROUPED PRODUCTION:", groupedProduction);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminViewExpiredHistory
        productName={item.id_products.name}
        quantity={item.quantity}
        potential_sales={item.potential_sales}
      />
    );
  };

  const keyExtractor = (item: any) => {
    // const date = new Date(item.created_at).toISOString().split("T")[0];
    // return `${item.location}_${date}`;
  };

  return (
    <View style={styles.container}>
      <View>
        <DropdownComponent data={filter} />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Quantity</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Potential Sales
        </Text>
      </View>
      <FlatList
        data={expiredProducts}
        // keyExtractor={keyExtractor}
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
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
  },
});

export default Index;
