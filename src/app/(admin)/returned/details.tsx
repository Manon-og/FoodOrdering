import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useBranch,
  useBranchData,
  useGetPendingProductsDetails,
  useLocalBranchData,
  useTransferReturnedBatch,
} from "@/src/api/products";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/src/components/Button";
import GroupedReturnedItemDetails from "@/components/AdminReturnReturnedProductDetails";
import Colors from "@/constants/Colors";
import BranchOptionsModal from "@/modals/branchModals";
import ReturnBranchOptionsModal from "@/modals/returnProductsModals";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();

  console.log("Branch data:", branch);
  console.log("Local branch data:", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: pendingProductsDetails } = useGetPendingProductsDetails();
  console.log("Pending pr:", pendingProductsDetails);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <GroupedReturnedItemDetails
        id_products={item.id_products.name}
        quantity={item.quantity}
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

  const { id_branch: branchID } = useLocalSearchParams();
  console.log("Branch ID:", branchID);

  const onSelectBranch = (
    id_branch: number,
    branchName: string
    // branchID: string
  ) => {
    console.log("Selected branch ID:", id_branch, branchName);
    setSelectedBranchName(id_branch);
    console.log("Selected branch IDIIII:", { newId_branch: Number(branchID) });
    transferReturnedBatch.mutate({ newId_branch: Number(branchID), id_branch });
    router.push("/(admin)/returned");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "" }} />
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Products</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Quantity</Text>
      </View>
      <FlatList
        data={pendingProductsDetails}
        renderItem={renderItem}
        // keyExtractor={(item) => item.id_products.id.toString()}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>TRANSFER</Text>
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
