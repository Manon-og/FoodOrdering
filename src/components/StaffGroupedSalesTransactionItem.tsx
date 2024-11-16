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
> = ({ id_group, id_number, amount, created_at }) => {
  console.log("id_group HEREEE", id_group);
  console.log("id_number HEREEE", amount);
  const link: any = `/(user)/transaction?id_group=${id_group}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{id_number}</Text>
          <Text style={styles.itemText}>{created_at}</Text>
          <Text style={styles.itemRight}> {amount}</Text>
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
