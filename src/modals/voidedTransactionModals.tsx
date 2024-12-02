import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import GroupedVoidSalesTransactionItem from "@/components/AdminGroupedVoidSalesTransactionItem";
import Colors from "@/constants/Colors";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  voidData: any[];
  totalVoidedSales: number;
  currentDate: string;
  currentDay: string;
};

const VoidedTransactionModal = ({
  modalVisible,
  setModalVisible,
  voidData,
  totalVoidedSales,
  currentDate,
  currentDay,
}: VoidedTransactionModalProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState<string>("");

  let filteredVoidedData =
    voidData?.filter((item: any) =>
      item.id_products.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredVoidedData.length / itemsPerPage);
  const paginatedVoidedData = filteredVoidedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderVoidedItem = ({ item }: { item: any }) => {
    const createdAtDate = new Date(item.created_at).toLocaleDateString();
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.dayText}>Voided Transaction</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.statusHeader]}>
              Product Name
            </Text>
            <Text style={[styles.headerText, styles.statusMiddle]}>
              Total Quantity
            </Text>
            <Text style={[styles.headerText, styles.moreInfoHeader]}>
              Total Amount
            </Text>
          </View>
          <FlatList
            data={paginatedVoidedData}
            keyExtractor={(item) => item.id_products.id_products.toString()}
            renderItem={renderVoidedItem}
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
            <Text style={styles.totalSalesText}> Total Voided Sales:</Text>
            <Text style={styles.totalSalesNumber}>₱{totalVoidedSales}</Text>
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, .6)",
  },
  modalView: {
    width: "90%",
    height: "82%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  dayText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "green",
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
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  totalSalesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  totalSalesText: {
    paddingTop: 40,
    fontSize: 16,
    fontWeight: "bold",
    color: "darkred",
  },
  totalSalesNumber: {
    paddingTop: 40,
    fontSize: 16,
    fontWeight: "bold",
    color: "darkred",
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 5,
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

export default VoidedTransactionModal;