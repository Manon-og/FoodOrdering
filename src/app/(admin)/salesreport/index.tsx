import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <GroupedReturnedItemDetails
        id_products={item.id_products.name}
        quantity={item.quantity}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "" }} />
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Products</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Quantity</Text>
      </View>
      <FlatList data={salesReportDetails} renderItem={renderItem} />
      <Text style={styles.totalText}>
        Total Sales:{" "}
        {salesReportDetails?.reduce(
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
        {salesReportDetails?.reduce(
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
});

export default Index;
