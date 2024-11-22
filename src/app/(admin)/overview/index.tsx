import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Button } from "react-native";
import { Dropdown } from "react-native-element-dropdown"; // Import the dropdown component
import {
  useGroupedSalesTransactionADMIN,
  useOverviewProductList,
} from "@/src/api/products";
import AdminOverView from "@/components/AdminOverView";
import { useBranchStoreAdmin } from "@/store/branchAdmin";

type OverviewItem = {
  totalQuantity: any;
  batch: { quantity: number } | null;
  localBatch: { place: any; quantity: any } | null;
  confirmedProduct: { place: any; quantity: any } | null;
  pendingLocalBatch: { place: any; quantity: any } | null;
  id_products: any;
  name: any;
  category: string;
  id_archive: number; // Add id_archive field
};

const Index = () => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  const { data: groupedSales } = useGroupedSalesTransactionADMIN();
  const { data: overview } = useOverviewProductList() as unknown as { data: OverviewItem[] };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  let filteredOverview = overview?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "" || item.category === selectedCategory) &&
    item.id_archive !== 1 // Filter out archived products
  );

  if (sortOrder === "asc") {
    filteredOverview = filteredOverview?.sort((a, b) => a.totalQuantity - b.totalQuantity);
  } else if (sortOrder === "desc") {
    filteredOverview = filteredOverview?.sort((a, b) => b.totalQuantity - a.totalQuantity);
  }

  const overallQuantity = filteredOverview?.reduce(
    (acc, item) => acc + item.totalQuantity,
    0
  );

  const totalPages = Math.ceil(filteredOverview.length / itemsPerPage);
  const paginatedOverview = filteredOverview.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderItem = ({ item }: { item: any }) => {
    const totalLocation = ["batch", "confirmedProduct", "localBatch", "pendingLocalBatch"]
      .map((key) => item[key]?.quantity > 0 ? 1 : 0)
      .reduce<number>((acc, curr) => acc + curr, 0);

    return (
      <AdminOverView
        name={item.name}
        totalQuantity={item.totalQuantity}
        numberOfPlaces={totalLocation}
        id_products={item.id_products}
      />
    );
  };

  const handleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === "default") return "asc";
      if (prevOrder === "asc") return "desc";
      return "default";
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.paginationContainer}>
          <Button title="Previous" onPress={handlePreviousPage} disabled={currentPage === 1} />
          <Text style={styles.pageNumber}>{currentPage} / {totalPages}</Text>
          <Button title="Next" onPress={handleNextPage} disabled={currentPage === totalPages} />
        </View>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Pressable onPress={handleSortOrder}>
          <Text style={[styles.headerText, styles.statusMiddle]}>Total Qty</Text>
        </Pressable>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Available In
        </Text>
      </View>

      <FlatList
        data={paginatedOverview}
        keyExtractor={(item) => item.id_products.toString()}
        renderItem={renderItem}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Overall Quantity: {overallQuantity}</Text>
      </View>
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
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    flex: 1,
  },
  dropdown: {
    height: 40,
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
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
    paddingLeft: 10,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
  },
  footer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: "#ccc",
    width: "100%",
    alignItems: "center",
  },
  footerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  pageNumber: {
    marginHorizontal: 10,
    fontSize: 16,
  },
});

export default Index;