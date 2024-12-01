import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useGroupedSalesTransaction } from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/StaffGroupedSalesTransactionItem";
import { useBranchStore } from "@/src/store/branch";

const Index = () => {
  const { id_branch, branchName } = useBranchStore();
  console.log("ZUSTANDSSS:", id_branch);
  console.log("ZUSTANDSSS:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: groupedSales }: any = useGroupedSalesTransaction(
    id_branch ?? ""
  );

  console.log("GROUPED SALESs:", groupedSales);
  let currentIdGroup = 1;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const filteredGroupedSales = groupedSales?.filter((item: any) => {
    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    return createdAtDate === currentDate;
  }) || [];

  const totalPages = Math.ceil(filteredGroupedSales.length / itemsPerPage);
  const paginatedGroupedSales = filteredGroupedSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const displayIdGroup = currentIdGroup;
    currentIdGroup++;
    console.log("TIME", item.created_at);

    const createdAtDate = new Date(item.created_at).toLocaleDateString();
    console.log("CREATED AT DATE:", createdAtDate);

    return (
      <GroupedSalesTransactionItem
        id_group={item.id_group}
        id_number={displayIdGroup.toString()}
        amount={item.amount_by_product}
        created_at={createdAtDate}
        transactions={item.transactions}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>
          Transaction
        </Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Date</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={paginatedGroupedSales}
        keyExtractor={(item) => item.id_group}
        renderItem={renderItem}
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
    top: 25,
    width: "100%", // Ensure the container takes full width
    alignItems: "center", // Center the children horizontally
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center", // Center the text
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
    textAlign: "center", // Center the text
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
});

export default Index;