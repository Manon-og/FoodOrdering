import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface ReturnProductsProps {
  name: string;
  quantity: number;
}

const ReturnProducts: React.FC<ReturnProductsProps> = ({ name, quantity }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{name}</Text>
      <Text style={styles.itemRight}>{quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  itemLeft: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 37,
  },
});

export default ReturnProducts;
