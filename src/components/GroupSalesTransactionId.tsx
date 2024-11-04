import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Transaction {
  id_number: string;
  id_salestransaction: number;
  id_products: number;
  quantity: number;
  created_by: string;
  id_branch: number;
  amount_by_product: number;
}

interface Product {
  name: string;
}

interface GroupedSalesTransactionItemProps {
  id_number: string;
  id_group: string;
  amount: number;
  quantity: number;
  created_at: string;
  transactions: Transaction[];
  amount_by_product: number;
  id_products: Product;
}

const GroupedSalesTransactionItem: React.FC<
  GroupedSalesTransactionItemProps
> = ({ id_number, quantity, amount, amount_by_product, id_products }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{id_products.name}</Text>
      <Text style={styles.itemText}> {quantity}</Text>
      <Text style={styles.itemRight}> ₱{amount_by_product}</Text>
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
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

export default GroupedSalesTransactionItem;
