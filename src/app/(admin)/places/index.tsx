import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useBranchProductList, useBackInventoryProductList, transferQuantity } from "@/src/api/products";
import { useBranchName } from "@/src/components/branchParams";

const ListItem = ({ item, isLocalBranch, onRestock }) => {
  const lowStock = item.quantity < 5; // Define low stock threshold
  return (
    <View style={styles.listItem}>
      <Text>{item.name}</Text>
      <Text>{item.quantity}</Text>
      {lowStock && (
        <Pressable style={styles.restockButton} onPress={() => onRestock(item.id_branch, item.id_products)}>
          <Text style={styles.restockButtonText}>Restock</Text>
        </Pressable>
      )}
    </View>
  );
};

export default function Locations() {
  const { id_branch, branchName } = useBranchName();
  const { data: branchProducts } = useBranchProductList(id_branch);
  const { data: backInventoryProducts } = useBackInventoryProductList();

  const currentDay = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const currentDate = new Date().toLocaleDateString("en-US");

  const handleRestock = (id_branch, id_product) => {
    console.log(`Restocking product ${id_product} for branch ${id_branch}`);
    transferQuantity({
      id_branch,
      id_products: id_product,
      quantity: 20,
    });
  };

  const renderItem = ({ item }) => {
    const isLocalBranch = branchProducts.some(
      (localItem) => localItem.id_branch === item.id_branch
    );
    console.log("id_branch:", item.id_branch);
    return <ListItem item={item} isLocalBranch={isLocalBranch} onRestock={handleRestock} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Status</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          More Info
        </Text>
      </View>
      <FlatList
        data={branchProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_branch.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 18,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusHeader: {
    flex: 1,
  },
  moreInfoHeader: {
    flex: 1,
    textAlign: "right",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  restockButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  restockButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});