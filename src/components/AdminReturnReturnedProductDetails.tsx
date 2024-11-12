import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  id_products: string;
  quantity: number;
}

const GroupedReturnedItemDetails: React.FC<
  GroupedSalesTransactionItemProps
> = ({ id_products, quantity }) => {
  //   console.log("id_group HEREEE", id_group);

  return (
    <Pressable>
      <View style={styles.itemContainer}>
        <Text style={styles.itemLeft}>{id_products}</Text>
        <Text style={styles.itemRight}>{quantity}</Text>
      </View>
    </Pressable>
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
    fontSize: 16,
    textAlign: "center",
    flex: 1,
    paddingLeft: "50%",
  },
  itemLeft: {
    fontSize: 18,
    color: "#333",
    flex: 1,
    paddingLeft: "5%",
    // borderRadius: 5,
    // borderStyle: "solid",
    // borderWidth: 1,
    // flex: 1,
  },
  itemRight: {
    fontSize: 18,
    color: "#333",
    paddingRight: "10%",
    // flexDirection: "row",
    // flex: 1,
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default GroupedReturnedItemDetails;
