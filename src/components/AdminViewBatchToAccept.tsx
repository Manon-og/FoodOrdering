import { useOverviewProductList } from "@/api/products";
import OverViewModal from "@/modals/overviewModals";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface GroupedSalesTransactionItemProps {
  places: string[];
  totalQuantity: number;
  expiry: string;
  totalQty: number;
}

const AdminViewBatchToAccept: React.FC<GroupedSalesTransactionItemProps> = ({
  places,
  totalQuantity,
  expiry,
  totalQty,
}) => {
  console.log("LINK:", places);

  console.log("111111", expiry);
  const dateNow = new Date();

  const yearNOW = dateNow.getFullYear();
  const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
  const dayNOW = String(dateNow.getDate()).padStart(2, "0");
  const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;

  console.log("Current Date:", currentDate);
  const date = new Date(expiry);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const newDateString = `${year}-${month}-${day}`;

  console.log("NEW 1111111", newDateString);

  return (
    <View>
      <View style={styles.itemContainer}>
        {newDateString === currentDate && (
          <View style={[styles.statusCircle, styles.redCircle]} />
        )}

        {expiry === currentDate && (
          <View style={[styles.statusCircleExpired]}>
            <Text>⚠️</Text>
          </View>
        )}
        <Text style={styles.itemLeft}>{places}</Text>
        <Text style={styles.itemMiddle}>{expiry}</Text>
        <Text style={styles.itemRight}>{totalQuantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statusCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
    position: "absolute",
    left: 10,
  },
  statusCircleExpired: {
    width: 25,
    height: 15,
    borderRadius: 7.5,
    // marginRight: 20,
    position: "absolute",
    left: 6,
  },

  redCircle: {
    backgroundColor: "darkred",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,

    borderBottomColor: "#ccc",
    paddingLeft: 35,
    paddingRight: 10,
  },
  itemLeft: {
    fontSize: 16,
    flex: 2,
    textAlign: "left",
  },
  itemMiddle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: 30,
    textAlign: "center",
  },
  itemRight: {
    fontSize: 16,
    textAlign: "right",
    paddingRight: 5,
    flex: 1,
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default AdminViewBatchToAccept;
