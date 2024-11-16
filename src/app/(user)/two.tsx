import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useGroupedSalesTransaction } from "@/src/api/products";

import GroupedSalesTransactionItem from "@/components/StaffGroupedSalesTransactionItem";
import { useBranchName } from "@/components/branchParams";
import { useBranchStore } from "@/src/store/branch";

const Index = () => {
  // const { branchName, id_branch } = useBranchName();
  // console.log("TRANSACTIONNN:", branchName);
  // console.log("TRANSACTIONNN:", id_branch);
  const { id_branch, branchName } = useBranchStore();
  console.log("ZUSTANDSSS:", id_branch);
  console.log("ZUSTANDSSS:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = new Date();
  console.log("DATEEEE:", date);
  console.log("DATEEEE:", currentDate);

  // const MemoizedProductListItem = memo(GroupedSalesTransactionItem); ayaw niya mag start sa 1, wtf.
  const { data: groupedSales }: any = useGroupedSalesTransaction(
    id_branch ?? ""
  );

  console.log("GROUPED SALESs:", groupedSales);
  let currentIdGroup = 1;

  const renderItem = ({ item }: { item: any }) => {
    const displayIdGroup = currentIdGroup;
    currentIdGroup++;
    console.log("TIME", item.created_at);

    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    console.log("CREATED AT DATE:", createdAtDate);

    if (createdAtDate !== currentDate) {
      return null;
    }

    return (
      <GroupedSalesTransactionItem
        id_group={item.id_group}
        id_number={displayIdGroup.toString()}
        amount={item.amount_by_product}
        created_at={createdAtDate}
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
          Transaction
        </Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Date</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={groupedSales}
        keyExtractor={(item) => item.id_group}
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
    paddingTop: "30%",
  },
  dateContainer: {
    position: "absolute",
    top: 25,
    width: "100%", // Ensure the container takes full width
    alignItems: "center", // Center the children horizontally
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center", // Center the text
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
    textAlign: "center", // Center the text
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
