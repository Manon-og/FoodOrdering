import { useOverviewProductList } from "@/api/products";
import OverViewModal from "@/modals/overviewModals";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface GroupedSalesTransactionItemProps {
  places: string[];
  totalQuantity: number;
}

const AdminOverViewDetails: React.FC<GroupedSalesTransactionItemProps> = ({
  places,
  totalQuantity,
}) => {
  console.log("LINK:", places);

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemLeft}>{places}</Text>
      <Text style={styles.itemRight}>{totalQuantity}</Text>
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
  itemLeft: {
    fontSize: 16,
    flex: 1,
    textAlign: "left",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 25,
    flex: 0,
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default AdminOverViewDetails;
