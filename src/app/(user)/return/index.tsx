import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useAllLocalBranchData,
  useInsertPendingProducts,
} from "@/src/api/products";
import { useBranchStore } from "@/src/store/branch";
import ReturnProducts from "@/components/ReturnProducts";
import Button from "@/src/components/Button";
import { useUUIDStore } from "@/store/user";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const { id_branch, branchName } = useBranchStore();
  console.log("RETURN id_branch:", id_branch);
  console.log("RETURN:", branchName);

  const { id } = useUUIDStore();
  console.log("RETURN id_user:", id);

  const transactionId = uuidv4();
  console.log("RETURN id_group:", transactionId);

  const { data: returnProducts } = useAllLocalBranchData(id_branch ?? "");
  console.log("RETURN PRODUCTS", returnProducts);

  const renderItem = ({ item }: { item: any }) => {
    console.log("RETURN PRODUCTS ITEM", item);
    return <ReturnProducts name={item.name} quantity={item.quantity} />;
  };

  const insertPendingProducts = useInsertPendingProducts();
  console.log("RETURN asdas:", {
    id_branch: Number(id_branch),
    id_user: id?.toString() ?? "",
    id_group: transactionId,
  });
  const handleInsertPendingProducts = () => {
    insertPendingProducts.mutate(
      {
        id_branch: Number(id_branch),
        id_user: id?.toString() ?? "",
        id_group: transactionId,
      },
      {
        onSuccess: (data) => {
          console.log("Inserted IDs:", data);
        },
        onError: (error) => {
          console.error("Error inserting pending products:", error);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>Return Products</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Products</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Quantity
        </Text>
      </View>
      <FlatList
        data={returnProducts}
        keyExtractor={(item: any) => item.id_products.toString()}
        renderItem={renderItem}
      />

      <Button text={"RETURN"} onPress={handleInsertPendingProducts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: "30%",
  },
  dateContainer: {
    position: "absolute",
    top: 50,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    paddingLeft: 13,
  },
  dayText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "green",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  statusHeader: {
    fontSize: 15,
    textAlign: "left",
    paddingLeft: 20,
    flex: 1,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    paddingRight: 20,
    textAlign: "right",
    flex: 1,
  },
});

export default Index;
