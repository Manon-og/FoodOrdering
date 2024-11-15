import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  created_at: string;
  amount_by_product: number;
  id_branch: number;
}

const AdminViewTransaction: React.FC<GroupedSalesTransactionItemProps> = ({
  id_branch,
  created_at,
  amount_by_product,
}) => {
  const date = new Date(created_at).toISOString().split("T")[0];
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{id_branch}</Text>
      <Text style={styles.itemText}>{date}</Text>
      <Text style={styles.itemRight}> {amount_by_product}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    paddingBottom: 20,
    borderBottomColor: "#ccc",
    paddingLeft: 10,
    paddingRight: 10,
  },

  itemText: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  itemLeft: {
    fontSize: 16,
    // fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default AdminViewTransaction;
