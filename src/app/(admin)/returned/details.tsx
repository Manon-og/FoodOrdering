import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import {
  useBranch,
  useBranchData,
  useGetPendingProductsDetails,
  useLocalBranchData,
  useReturnedBatch,
  useTransferReturnedBatch,
} from "@/src/api/products";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/src/components/Button";
import GroupedReturnedItemDetails from "@/components/AdminReturnReturnedProductDetails";
import Colors from "@/constants/Colors";
import BranchOptionsModal from "@/modals/branchModals";
import ReturnBranchOptionsModal from "@/modals/returnProductsModals";
import uuid from "react-native-uuid";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();

  const { id_branch } = useLocalSearchParams();
  console.log("Branch data>>>>>>>>:", id_branch);

  console.log("Local branch data:", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: pendingProductsDetails } = useGetPendingProductsDetails(
    id_branch.toString()
  );
  console.log("Pending pr:", pendingProductsDetails);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState<string>("");

  let filteredProducts =
    pendingProductsDetails?.filter((item: any) =>
      item.id_products.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    console.log("Item ID:", item.id_products.id_products);
    console.log("Item ID:", item.quantity);
    console.log("Item ID:", item.expire_date);
    console.log("Item ID:", item);
    console.log("Item ID:", item.id_branch.id_branch);
    return (
      <GroupedReturnedItemDetails
        id_products={item.id_products.id_products}
        name={item.id_products.name}
        quantity={item.quantity}
        expire_date={item.expire_date}
        data={pendingProductsDetails}
        data_id={item}
        id_branch={item.id_branch.id_branch}
      />
    );
  };

  const router = useRouter();
  const { data: place } = useBranch();

  console.log("place:", place);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState<number | null>(
    null
  );

  const transferReturnedBatch = useTransferReturnedBatch();
  const returnBackInventory = useReturnedBatch();

  const { id_branch: branchID } = useLocalSearchParams();
  console.log("Branch ID:", branchID);

  const handleReturn = () => {
    returnBackInventory.mutate({ newId_branch: Number(branchID) });
    router.push("/(admin)/returned");
  };

  const newIDgroup = uuid.v4();
  const onSelectBranch = (
    id_branch: number,
    branchName: string
    // branchID: string
  ) => {
    console.log("Selected branch ID:", id_branch, branchName);
    setSelectedBranchName(id_branch);
    console.log("Selected branch IDIIII:", { newId_branch: Number(branchID) });
    transferReturnedBatch.mutate({
      newId_branch: Number(branchID),
      id_branch,
      newId_Group: newIDgroup,
    });
    router.push("/(admin)/returned");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "" }} />
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
        <Text style={[styles.headerText, styles.statusHeader]}>Products</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Qty</Text>
      </View>
      <FlatList
        data={paginatedProducts}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id_products.id_products.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReturn}>
          <Text style={styles.buttonText}>Return Back Inventory</Text>
        </TouchableOpacity>
      </View>
      <ReturnBranchOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        branches={place || []}
        onSelectBranch={onSelectBranch}
        branchName={selectedBranchName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 5.5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dateContainer: {
    position: "absolute",
    top: 50,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
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
    textAlign: "left",
    flex: 0.5,
    paddingLeft: 35,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
    paddingRight: "15%",
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
    padding: 10,
    margin: 6,
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
});

export default Index;
