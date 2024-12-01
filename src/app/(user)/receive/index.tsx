import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import {
  useBranchData,
  useGetPendingProducts,
  useLocalBranchData,
  useInsertReceivePendingStocks,
  useGetReceivePendingStocks,
} from "@/src/api/products";

import GroupedReturnedItem from "@/components/AdminReturnReturnedProducts";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useBranchName } from "@/components/branchParams";
import StaffViewPendingProducts from "@/components/StaffViewPendingProducts";
import Button from "@/components/Button";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();

  const { id_branch, branchName } = useBranchName();
  console.log("asdxzc:", id_branch);

  const receiveStocks = useInsertReceivePendingStocks();
  const { data: viewPendingProducts } = useGetReceivePendingStocks(id_branch);
  console.log("viewPendingProducts:", viewPendingProducts);

  console.log("Branch data:", branch);
  console.log("Local branch data:", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: pendingProducts } = useGetPendingProducts();
  console.log("Pending products??:", pendingProducts);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState<string>("");

  let filteredProducts =
    viewPendingProducts?.filter((item: any) =>
      item.id_products.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalQuantity: any = filteredProducts.reduce(
    (acc, item: any) => acc + item.quantity,
    0
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("Filtered productssad:", paginatedProducts);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const createdAtDate = item.created_at.split("T")[0];
    console.log("IDBRNch:", item.id_branch.id_branch);
    return (
      <StaffViewPendingProducts
        name={item.id_products.name}
        quantity={item.quantity}
      />
    );
  };

  const router = useRouter();
  const handleAcceptPress = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to accept the pending products?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            receiveStocks.mutate(id_branch);
            router.push(
              `/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`
            );
            Alert.alert("Accepted", "You have accepted the pending products.");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Pending Stocks",
        }}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Qty</Text>
      </View>

      <FlatList
        data={paginatedProducts}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id_products.name}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContainer}
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
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Qty</Text>
      </View>

      <FlatList
        data={paginatedProducts}
        renderItem={renderItem}
        // keyExtractor={(item: any) => item.id_products.name}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContainer}
      />

      <Text style={styles.totalQuantityText}>
        Total Quantity: {totalQuantity}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleAcceptPress}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFD895",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "black",
    fontSize: 17,
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // paddingTop: "20%",
  },
  dateContainer: {
    position: "absolute",
    top: "2.5%",
  },
  dateText: {
    fontSize: 20,
    color: "gray",
    textAlign: "center",
  },
  dayText: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0E1432",
    textAlign: "center",
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
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  statusHeader: {
    textAlign: "left",
    flex: 0.5,
    paddingLeft: "5%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
    paddingRight: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
  flatListContainer: {
    paddingBottom: 20,
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
  totalQuantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default Index;
