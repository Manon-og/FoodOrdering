import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

interface Transaction {
  id_salestransaction: number;
  id_products: number;
  quantity: number;
  created_by: string;
  id_branch: number;
}

interface TransactionDetailsProps {
  transactions: Transaction[];
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactions,
}) => {
  return (
    <View style={styles.container}>
      {transactions.map((transaction) => (
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
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  transactionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default TransactionDetails;
