import {
  useGetPendingProductsDetailsById,
  useProductByIdForReturnedProducts,
  useProductForReturnedProducts,
} from "@/api/products";
import ReturnedViewProductModal from "@/modals/returnedProductModals";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";

interface GroupedSalesTransactionItemProps {
  name: string;
  quantity: number;
}

const SalesTransactionDetails: React.FC<GroupedSalesTransactionItemProps> = ({
  name,
  quantity,
}) => {
  return (
    <>
      <View style={styles.itemContainer}>
        <View style={styles.itemLeftContainer}>
          <Text style={styles.itemLeft}>{name}</Text>
        </View>
        <Text style={styles.itemRight}>{quantity}</Text>
      </View>
    </>
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
    borderBottomColor: "#ccc",
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemLeftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  warning: {
    marginLeft: 5,
  },
  itemLeft: {
    fontSize: 16,
    textAlign: "left",
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "black",
    paddingLeft: 25,
  },
  itemRight: {
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "black",
    fontSize: 16,
    textAlign: "center",
    paddingRight: "15%",
  },
});

export default SalesTransactionDetails;
