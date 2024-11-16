import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useGroupedSalesTransaction,
  useGroupedSalesTransactionADMIN,
  useOverviewProductList,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import AdminViewTransaction from "@/components/AdminViewTransaction";
import DropdownComponent from "@/components/DropDown";
import AdminOverView from "@/components/AdminOverView";

const Index = () => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  console.log("ADMIN TRANSACTION:", id_branch);
  console.log("ADMIN TRANSACTION:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: groupedSales }: any = useGroupedSalesTransactionADMIN();
  console.log("GROUPED SALESs:", groupedSales);

  const { data: overview } = useOverviewProductList();
  console.log("PRODUCT LISTs:", overview);

  const renderItem = ({ item }: { item: any }) => {
    let totalLocation = 0;

    if (
      item.batch !== undefined &&
      item.batch !== null &&
      item.batch.quantity > 0
    ) {
      totalLocation += 1;
    }
    if (
      item.confirmedProduct !== undefined &&
      item.confirmedProduct !== null &&
      item.confirmedProduct.quantity > 0
    ) {
      totalLocation += 1;
    }
    if (
      item.localBatch !== undefined &&
      item.localBatch !== null &&
      item.localBatch.quantity > 0
    ) {
      totalLocation += 1;
    }
    if (
      item.pendingLocalBatch !== undefined &&
      item.pendingLocalBatch !== null &&
      item.pendingLocalBatch.quantity > 0
    ) {
      totalLocation += 1;
    }

    console.log("TOTAL LOCATION:", totalLocation);

    return (
      <AdminOverView
        name={item.name}
        totalQuantity={item.totalQuantity}
        numberOfPlaces={totalLocation}
        id_products={item.id_products}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {/* <DropdownComponent/> filter for the transfering of products but not sure ano itsura*/}
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Total Qty</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Available In
        </Text>
      </View>
      <FlatList
        data={overview}
        keyExtractor={(item) => item.id_products.toString()}
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
