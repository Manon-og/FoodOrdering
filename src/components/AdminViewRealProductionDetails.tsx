import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  name: string;
  quantity: number;
  date: string;
}

const AdminViewRealProductionDetails: React.FC<
  GroupedSalesTransactionItemProps
> = ({ name, quantity, date }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{name}</Text>
      <Text style={styles.itemMiddle}>{date}</Text>
      <Text style={styles.itemRight}>{quantity}</Text>
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
  itemMiddle: {
    fontSize: 16,
    // fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    paddingLeft: "18%",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
    paddingRight: 10,
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default AdminViewRealProductionDetails;
