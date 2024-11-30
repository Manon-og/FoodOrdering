import { FontAwesome } from "@expo/vector-icons";
import { router, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";

import {
  useBranchAllProductList,
  useBranchName,
  useDeleteLocalBatch,
  useGetCashCount,
  useGetComment,
  useGetInitialCashCount,
  useGetVoidedTransaction,
  useGroupedSalesReport,
} from "@/src/api/products";

import { useBranchStoreAdmin } from "@/store/branchAdmin";

import Colors from "@/constants/Colors";
import { useUUIDStore } from "@/store/user";
import { useIdGroupStore } from "@/store/idgroup";
import ItemExpireDetailsReturn from "@/components/ItemsDetailsReturn";
import ViewCommentModal from "@/modals/viewCommentModals";

const Details = ({ ddd }: any) => {
  const { id_branch } = useBranchStoreAdmin();
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const { data: products } = useBranchAllProductList(id_branch?.toString() ?? "");
  const deleteLocalBatch = useDeleteLocalBatch();
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const addProductToSummary = (item: any) => {
    setSelectedProducts((prev) => [...prev, { name: item.name, qty: item.quantity }]);
  };

  const renderItem = ({ item }: any) => {
    const date = new Date(item.expiry_date);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const newDateString = `${year}-${month}-${day}`;

    return (
      <TouchableOpacity onPress={() => addProductToSummary(item)}>
        <ItemExpireDetailsReturn
          item={item}
          expiry={newDateString}
          id_batch={item.id_batch}
          id_branch={id_branch}
        />
      </TouchableOpacity>
    );
  };

  const handleInsertPendingProducts = () => {
    setIsButtonDisabled(true);
    deleteLocalBatch.mutate(
      {
        id_branch: Number(id_branch),
      },
      {
        onSuccess: (data) => {
          Alert.alert("Success", "Request for return products accepted");
          router.push("/(admin)/profile");
        },
        onError: (error) => {
          console.error("Error inserting pending products:", error);
          setIsButtonDisabled(false);
        },
      }
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setSummaryModalVisible(true)}
              disabled={isButtonDisabled}
            >
              <Text style={[styles.confirmText, isButtonDisabled && styles.disabledText]}>
                ACCEPT
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id_products.toString()}
        />
      </View>

      {/* Summary Modal */}
      <Modal visible={summaryModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Summary</Text>
            {selectedProducts.map((product, index) => (
              <Text key={index} style={styles.productText}>
                {product.name}: {product.qty} pcs
              </Text>
            ))}
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleInsertPendingProducts}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSummaryModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  confirmText: { color: "blue" },
  disabledText: { color: "gray" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  productText: { fontSize: 16, marginVertical: 5 },
  acceptButton: { backgroundColor: "green", padding: 10, marginTop: 10 },
  cancelButton: { backgroundColor: "red", padding: 10, marginTop: 10 },
  buttonText: { color: "#fff" },
});

export default Details;
