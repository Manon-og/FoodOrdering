import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Transaction {
  name: string;
  quantity: number;
}

const StaffViewPendingProducts: React.FC<Transaction> = ({
  name,
  quantity,
}) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{name}</Text>

      <Text style={styles.itemRight}> {quantity}</Text>
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
    marginRight: 15,
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default StaffViewPendingProducts;
