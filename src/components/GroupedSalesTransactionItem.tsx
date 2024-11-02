import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Transaction {
  id_salestransaction: number;
  id_products: number;
  quantity: number;
  created_by: string;
  id_branch: number;
}

interface GroupedSalesTransactionItemProps {
  id_number: string;
  id_group: string;
  amount: number;
  created_at: string;
  transactions: Transaction[];
}

const GroupedSalesTransactionItem: React.FC<
  GroupedSalesTransactionItemProps
> = ({ id_group, id_number, amount, created_at, transactions }) => {
  console.log("id_group HEREEE", id_group);
  const link: any = `/(user)/transaction?id_group=${id_group}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{id_number}</Text>
          <Text style={styles.itemText}>{created_at}</Text>
          <Text style={styles.itemRight}> {amount}</Text>

          {/* {transactions.map((transaction) => (
        <View
          key={transaction.id_salestransaction}
          style={styles.transactionContainer}
        >
          <Text style={styles.itemText}>
            Transaction ID: {transaction.id_salestransaction}
          </Text>
          <Text style={styles.itemText}>
            Product ID: {transaction.id_products}
          </Text>
          <Text style={styles.itemText}>Quantity: {transaction.quantity}</Text>
          <Text style={styles.itemText}>
            Created By: {transaction.created_by}
          </Text>
          <Text style={styles.itemText}>
            Branch ID: {transaction.id_branch}
          </Text>
        </View>
      ))} */}
        </View>
      </Pressable>
    </Link>
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
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    paddingLeft: 10,
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
