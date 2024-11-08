import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ItemDetailsReturn = ({ item }: any) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemBefore}> {item.quantity}</Text>
      <Text style={styles.itemAfter}> {item.quantity}</Text>
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
  },
  itemText: {
    fontSize: 18,
    maxWidth: "67%",
    color: "#333",
    flex: 1,
  },
  itemBefore: {
    fontSize: 18,
    color: "#333",
  },
  itemAfter: {
    fontSize: 18,
    color: "#333",
    paddingRight: 10,
  },
});

export default ItemDetailsReturn;
