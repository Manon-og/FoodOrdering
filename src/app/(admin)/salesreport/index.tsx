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
  useBranchData,
  useGetTotalSalesReport,
  useGetVoidedTransactionADMIN,
  useLocalBranchData,
} from "@/src/api/products";
import { Stack, useLocalSearchParams } from "expo-router";

import GroupedReturnedItemDetails from "@/components/AdminReturnReturnedProductDetails";
import Colors from "@/constants/Colors";
import VoidedTransactionModal from "@/modals/voidedTransactionModals";
import VoidedTransactionModalADMIN from "@/modals/voidedTransactionModalsADMIN";
import SalesTransactionDetails from "@/components/AdminSalesTransactionDetails";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();
  const [modalVisible, setModalVisible] = useState(false);

  console.log("Branch data:", branch);
  console.log("Local branch data:", localBranch);

  const {
    created_at: date,
    id_branch: currentBranch,
    created_by: name,
  } = useLocalSearchParams();

  const { data: voidData }: any = useGetVoidedTransactionADMIN(
    currentBranch.toString(),
    date.toString()
  );

  const totalVoidedSales =
    voidData?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  console.log("Current branch:", currentBranch);
  console.log("Date:", date);
  console.log("Name:", name);

  const { data: salesReportDetails } = useGetTotalSalesReport(
    currentBranch.toString(),
    date.toString()
  );
  console.log("Sales Report:", salesReportDetails);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState<string>("");

  let filteredSales =
    salesReportDetails?.filter((item: any) =>
      item.id_products.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <SalesTransactionDetails
        name={item.id_products.name}
        quantity={item.quantity}
      />
    );
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
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Quantity</Text>
      </View>
      <FlatList
        data={paginatedSales}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id_products.name}
      />
      <Text style={styles.totalText}>
        Total Sales:{" "}
        {filteredSales?.reduce(
          (acc: number, item: any) => acc + item.amount_by_product,
          0
        )}
      </Text>
      <VoidedTransactionModalADMIN
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        voidData={voidData}
        totalVoidedSales={totalVoidedSales}
      />
      <Text style={styles.createdBy}> {date} </Text>

      <Text style={styles.createdBy}>
        Total Quantity:{" "}
        {filteredSales?.reduce(
          (acc: number, item: any) => acc + item.quantity,
          0
        )}
      </Text>
      <Text style={styles.createdBy}>Created By: {name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Voided Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
    paddingVertical: 20,
  },
  createdBy: {
    fontSize: 15,
    color: "gray",
  },
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
    paddingLeft: 20,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
    paddingRight: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: "100%",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 0,
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
});

export default Index;