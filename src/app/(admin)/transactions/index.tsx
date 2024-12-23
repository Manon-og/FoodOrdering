import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import {
  useGetVoidedTransaction,
  useGroupedSalesReport,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import GroupedVoidSalesTransactionItem from "@/components/AdminGroupedVoidSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import Colors from "@/constants/Colors";
import { useDateStore } from "@/store/dateAdmin";
import VoidedTransactionModal from "@/modals/voidedTransactionModals";
import { useSalesStore } from "@/store/totalSalesAdmin";
import { useVoidedSalesStore } from "@/store/totalVoidedSalesAdmin";

const Index = () => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  console.log("ADMIN TRANSACTION:", id_branch);
  console.log("ADMIN TRANSACTION:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = new Date();
  console.log("DATE:", date);

  const { data: salesReport }: any = useGroupedSalesReport(
    id_branch?.toString(),
    date
  );

  console.log("SALES REPORT++++:", salesReport);

  const setDate = useDateStore((state) => state.setDate);

  useEffect(() => {
    setDate(currentDate);
  }, [setDate]);

  const { Ddate } = useDateStore();
  console.log("DDATE>:", Ddate);

  console.log("LAST NA TO:", salesReport);

  const { data: voidData }: any = useGetVoidedTransaction(
    id_branch?.toString(),
    date
  );
  console.log("VOID DATA:", voidData);

  const filteredSalesReport =
    salesReport?.filter((item: any) =>
      item.id_products.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredSalesReport.length / itemsPerPage);
  const paginatedSalesReport = filteredSalesReport.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderSalesItem = ({ item }: { item: any }) => {
    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    console.log("CREATED DATE ++++:", createdAtDate);
    console.log("CURRENT DATE:", currentDate);

    if (createdAtDate !== currentDate) {
      return null;
    }

    return (
      <GroupedSalesTransactionItem
        id_products={item.id_products.name}
        quantity={item.quantity}
        amount_by_product={item.amount_by_product}
        transactions={item.transactions}
      />
    );
  };

  const renderVoidedItem = ({ item }: { item: any }) => {
    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    console.log("CREATED DATE:", createdAtDate);
    console.log("CURRENT DATE:", currentDate);

    if (createdAtDate !== currentDate) {
      return null;
    }

    return (
      <GroupedVoidSalesTransactionItem
        id_products={item.id_products.name}
        quantity={item.quantity}
        amount_by_product={item.amount_by_product}
        transactions={item.transactions}
      />
    );
  };

  const totalSales =
    salesReport?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  const setSales = useSalesStore((state) => state.setSales);

  useEffect(() => {
    setSales(totalSales);
  }, [setSales]);

  const { sales } = useSalesStore();
  console.log("sales:", sales);

  const totalVoidedSales =
    voidData?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  const setVoid = useVoidedSalesStore((state) => state.setVoid);

  useEffect(() => {
    setVoid(totalVoidedSales);
  }, [setVoid]);

  const { voidSales } = useVoidedSalesStore();
  console.log("voidSales:", voidSales);

  return (
    <View style={styles.container}>
      <Text style={styles.dayText}>Sales Transaction</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by product name..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>
          Product Name
        </Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>
          Total Qty
        </Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={paginatedSalesReport}
        keyExtractor={(item) => item.id_products.id_products.toString()}
        renderItem={renderSalesItem}
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
      <View style={styles.totalSalesContainer}>
        <Text style={styles.totalSalesText}>Total Sales:</Text>
        <Text style={styles.totalSalesNumber}>₱{totalSales}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Voided Transaction</Text>
      </TouchableOpacity>
      <VoidedTransactionModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        voidData={voidData}
        totalVoidedSales={totalVoidedSales}
        currentDate={currentDate}
        currentDay={currentDay}
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#0E1432",
    paddingBottom: 10,
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  totalSalesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  totalSalesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
  },
  totalSalesNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
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
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
});

export default Index;