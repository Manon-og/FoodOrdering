import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Transaction {
  id_salestransaction: number;
  id_products: number;
  quantity: number;
  created_by: string;
  id_branch: number;
  amount_by_products: number;
  amount: number;
}

interface GroupedVoidSalesTransactionItemProps {
  id_products: string;
  quantity: number;
  amount_by_product: number;
  transactions: Transaction[];
}

const GroupedVoidSalesTransactionItem: React.FC<
  GroupedVoidSalesTransactionItemProps
> = ({ id_products, quantity, amount_by_product }) => {
  console.log("id_products", id_products);
  console.log("quantity", quantity);
  console.log("amount_by_product", amount_by_product);
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{id_products}</Text>
      <Text style={styles.itemText}>{quantity}</Text>
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

export default GroupedVoidSalesTransactionItem;
