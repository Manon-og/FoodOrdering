import React, { memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useGroupedSalesTransaction,
  useSalesTransactionById,
} from "@/src/api/products";

import GroupedSalesTransactionId from "@/components/GroupSalesTransactionId";
import { useLocalSearchParams } from "expo-router";

const Index = () => {
  const { id_group } = useLocalSearchParams();
  console.log("id_group UPADTEEE", id_group);
  const { data: salesTransaction } = useSalesTransactionById(
    id_group.toString()
  );
  console.log("WHADBJHSBHA UPADTEEE", salesTransaction);
  const amount = salesTransaction?.[0]?.amount;
  const user = salesTransaction?.[0]?.created_by;
  const location = salesTransaction?.[0]?.id_branch.place;
  const time = salesTransaction?.[0]?.created_at.split("T")[1].split(".")[0];
  const sunMoon = time.split(":")[0] >= 12 ? "PM" : "AM";
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // const MemoizedProductListItem = memo(GroupedSalesTransactionItem); ayaw niya mag start sa 1, wtf.
  const { data: groupedSales }: any = useGroupedSalesTransaction();
  let currentIdGroup = 1;

  const renderItem = ({ item }: { item: any }) => {
    const displayIdGroup = currentIdGroup;
    currentIdGroup++;
    console.log("TIME", item.created_at);
    const createdAtDate = item.created_at.split("T")[0];

    return (
      <GroupedSalesTransactionId
        id_products={item.id_products}
        id_group={item.id_group}
        id_number={displayIdGroup.toString()}
        amount={item.amount}
        created_at={createdAtDate}
        transactions={item.transactions}
        amount_by_product={item.amount_by_product}
        quantity={item.quantity}
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
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Quantity</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={salesTransaction}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_salestransaction}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{amount}</Text>
        <Text style={styles.createdBy}>Created by: {user}</Text>
        <Text style={styles.createdBy}>Location: {location}</Text>
        <Text style={styles.createdBy}>
          {time} {sunMoon}
        </Text>
      </View>
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
  footer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
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
    paddingLeft: 10,
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
    paddingRight: 10,
  },
  createdBy: {
    fontSize: 15,
    color: "gray",
  },
});

export default Index;
