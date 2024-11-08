import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ItemDetails = ({ item }: any) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      {/* <Text style={styles.lowStock}>
        {item.quantity <= 10 ? "low stock" : ""}
      </Text>  PRE POTA MAGUBA ANG UI PAG NAA NI*/}
      <Text style={styles.itemQuantity}> {item.quantity}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // height: 50,
    paddingVertical: 10,
    borderBottomWidth: 2,
    paddingBottom: 20,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 18,
    color: "#333",
    flex: 1,
    // borderRadius: 5,
    // borderStyle: "solid",
    // borderWidth: 1,
    // flex: 1,
  },
  itemQuantity: {
    fontSize: 18,
    color: "#333",
    // flexDirection: "row",
    // flex: 1,
  },
  lowStock: {
    fontSize: 10,
    flex: 1,
    //to be fixed
    textAlign: "left",
    color: "darkred",
  },
});

export default ItemDetails;
