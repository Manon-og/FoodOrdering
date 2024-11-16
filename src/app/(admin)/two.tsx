import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useGroupedSalesTransaction,
  useGroupedSalesTransactionADMIN,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import AdminViewTransaction from "@/components/AdminViewTransaction";
import DropdownComponent from "@/components/DropDown";

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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminViewTransaction
        place={item.id_branch.place}
        id_branch={item.id_branch.id_branch}
        created_at={item.created_at}
        amount_by_product={item.amount_by_product}
        created_by={item.created_by}
      />
    );
  };

  const keyExtractor = (item: any) => {
    const date = new Date(item.created_at).toISOString().split("T")[0];
    return `${item.id_branch.id_branch}_${date}`;
  };

  return (
    <View style={styles.container}>
      <View>
        {/* <DropdownComponent/> filter for the transfering of products but not sure ano itsura*/}
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Location</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Date</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={groupedSales}
        keyExtractor={keyExtractor}
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
    paddingTop: "20%",
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
