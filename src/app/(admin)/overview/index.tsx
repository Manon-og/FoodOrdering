import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
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
  id_archive: number;
};

const Index = () => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  const { data: groupedSales } = useGroupedSalesTransactionADMIN();
  const { data: overview } = useOverviewProductList() as unknown as {
    data: OverviewItem[];
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">(
    "default"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; 

  let filteredOverview =
    overview?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        item.id_archive !== 1
    ) || [];

  if (sortOrder === "asc") {
    filteredOverview = filteredOverview.sort(
      (a, b) => a.totalQuantity - b.totalQuantity
    );
  } else if (sortOrder === "desc") {
    filteredOverview = filteredOverview.sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );
  }

  const overallQuantity = filteredOverview.reduce(
    (acc, item) => acc + item.totalQuantity,
    0
  );
  const totalPages = Math.ceil(filteredOverview.length / itemsPerPage);
  const paginatedOverview = filteredOverview.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const totalLocation = [
      "batch",
      "confirmedProduct",
      "localBatch",
      "pendingLocalBatch",
    ]
      .map((key) => (item[key]?.quantity > 0 ? 1 : 0))
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.paginationContainer}>
        <Pressable
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}
        >
          <Text style={styles.pageButtonText}>{"<"}</Text>
        </Pressable>

        {Array.from({ length: totalPages }, (_, index) => (
          <Pressable
            key={index}
            onPress={() => handlePageChange(index + 1)}
            style={[
              styles.pageButton,
              currentPage === index + 1 && styles.activePageButton,
            ]}
          >
            <Text style={styles.pageButtonText}>{index + 1}</Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
        >
          <Text style={styles.pageButtonText}>{">"}</Text>
        </Pressable>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Product</Text>
        <Pressable
          onPress={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          <Text style={styles.headerText}>Total Qty</Text>
        </Pressable>
        <Text style={styles.headerText}>Available In</Text>
      </View>
      <FlatList
        data={paginatedOverview}
        keyExtractor={(item) => item.id_products.toString()}
        renderItem={renderItem}
        scrollEnabled={false} // Disable scrolling
        contentContainerStyle={styles.flatListContainer}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Overall Quantity: {overallQuantity}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  flatListContainer: {
    minHeight: 200, 
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  pageButton: {
    padding: 8,
    margin: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: "gray",
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 16,
  },
  totalText: {
    textAlign: "right",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Index;
