import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useGetProductionHistory,
  useGroupedSalesTransactionADMIN,
} from "@/src/api/products";
import AdminViewProduction from "@/components/AdminViewProduction";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import { Dropdown } from "react-native-element-dropdown"; // Import the dropdown component

const Index = () => {
  const filter = [
    { label: "Sales Transaction", value: "Sales Transaction" },
    { label: "Production", value: "Production" },
    { label: "Expired Products", value: "Expired Products" },
  ];
  const { id_branch, branchName } = useBranchStoreAdmin();
  console.log("ADMIN TRANSACTION:", id_branch);
  console.log("ADMIN TRANSACTION:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: groupedSales }: any = useGroupedSalesTransactionADMIN();
  const { data: groupedProduction }: any = useGetProductionHistory();
  console.log("GROUPED SALESs:", groupedSales);
  console.log("GROUPED PRODUCTION:", groupedProduction);

  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminViewProduction
        location={item.location}
        created_at={item.created_at}
        quantity={item.quantity}
      />
    );
  };

  const keyExtractor = (item: any) => {
    const date = new Date(item.created_at).toISOString().split("T")[0];
    return `${item.location}_${date}`;
  };

  return (
    <View style={styles.container}>
      <View>
        <Dropdown
          data={filter}
          labelField="label"
          valueField="value"
          placeholder="Select Transaction Type"
          value={selectedFilter}
          onChange={(item) => setSelectedFilter(item.value)}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderText}
          selectedTextStyle={styles.selectedText}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Location</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Date</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Quantity
        </Text>
      </View>
      <FlatList
        data={groupedProduction}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dropdown: {
    width: 300,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  placeholderText: {
    color: "gray",
    fontSize: 16,
  },
  selectedText: {
    color: "black",
    fontSize: 16,
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
    textAlign: "right",
    flex: 1,
  },
});

export default Index;