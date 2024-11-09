import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useGroupedSalesReport } from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";

const Index = () => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  console.log("ADMIN TRANSACTION:", id_branch);
  console.log("ADMIN TRANSACTION:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = new Date();
  console.log("DATE:", date);

  const { data: salesReport }: any = useGroupedSalesReport(
    id_branch?.toString(),
    date
  );

  console.log("LAST NA TO:", salesReport);

  const renderItem = ({ item }: { item: any }) => {
    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    console.log("CREATED DATE:", createdAtDate);
    console.log("CURRENT DATE:", currentDate);

    if (createdAtDate !== currentDate) {
      return null;
    }

    return (
      <GroupedSalesTransactionItem
        id_products={item.id_products.name}
        quantity={item.quantity}
        amount_by_product={item.amount_by_product}
        transactions={item.transactions}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
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
        data={salesReport}
        keyExtractor={(item) => item.id_products.id_products.toString()}
        renderItem={renderItem}
      />
      {/* <FlatList
        data={salesReport}
        keyExtractor={(item) => item.id_products.id_products.toString()}
        renderItem={renderItem}
      /> */}
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
    textAlign: "right",
    flex: 1,
  },
});

export default Index;
