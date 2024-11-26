import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  from: string;
  to: number;
  quantity: string;
  date: string;
}

const AdminReturnReturnedProductsHistory: React.FC<
  GroupedSalesTransactionItemProps
> = ({ from, to, quantity, date }) => {
  const link: any = `/(admin)/returnedhistory?from=${from}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{from}</Text>
          <Text style={styles.itemMiddle}>{to}</Text>
          <Text style={styles.itemRight}>{date}</Text>
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
    // fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    paddingLeft: "7%",
  },
  itemMiddle: {
    fontSize: 16,
    // fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    paddingRight: "16%",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
    paddingRight: "1%",
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default AdminReturnReturnedProductsHistory;
