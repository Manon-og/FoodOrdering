import { FontAwesome } from "@expo/vector-icons";
import { router, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  useBranchAllProductList,
  useBranchName,
  useDeleteLocalBatch,
  useGetCashCount,
  useGetVoidedTransaction,
  useGroupedSalesReport,
} from "@/src/api/products"; // Adjust the import path accordingly

import { useBranchStoreAdmin } from "@/store/branchAdmin";
import ItemDetailsReturn from "@/components/ItemsDetailsReturn";
import Colors from "@/constants/Colors";
import { useCashStore } from "@/store/cashcountAdmin";
import { useSalesStore } from "@/store/totalSalesAdmin";
import { useVoidedSalesStore } from "@/store/totalVoidedSalesAdmin";
import { useUUIDStore } from "@/store/user";
import { useIdGroupStore } from "@/store/idgroup";

const Details = ({ ddd }: any) => {
  const { id_branch, branchName } = useBranchStoreAdmin();

  const { data: products } = useBranchAllProductList(
    id_branch?.toString() ?? ""
  );
  const { data: branch } = useBranchName(Number(id_branch));

  let name = "";

  branch?.forEach((b: any) => {
    name = b.place;
  });

  const { data: cashcount } = useGetCashCount(
    id_branch ? id_branch.toString() : ""
  );

  const cashCountData = cashcount && cashcount.length > 0 ? cashcount[0] : {};
  const cashCount = cashCountData.total;

  const date = new Date();

  const { data: salesReport }: any = useGroupedSalesReport(
    id_branch?.toString(),
    date
  );

  console.log("RETURN salesReport:", salesReport);
  const created_by = salesReport?.map((item: any) => item.created_by);

  const totalSales =
    salesReport?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  const { data: voidData }: any = useGetVoidedTransaction(
    id_branch?.toString(),
    date
  );

  const totalVoidedSales =
    voidData?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  const totalQuantity = products?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const renderItem = ({ item }: any) => {
    return <ItemDetailsReturn item={item} />;
  };

  const router = useRouter();

  const handleTransaction = () => {
    router.push("/(admin)/transactions");
  };

  const handleCashCount = () => {
    router.push("/(admin)/cashcount");
  };

  console.log("RETURN id_group:", ddd);

  const { id } = useUUIDStore();
  console.log("RETURN id_user:", id);

  const { idGroup } = useIdGroupStore();
  console.log("idGroup>:", idGroup);

  const deleteLocalBatch = useDeleteLocalBatch();
  console.log("DELETE:", deleteLocalBatch);
  console.log("RETURN asdas:", {
    id_branch: Number(id_branch),
  });

  const handleInsertPendingProducts = () => {
    deleteLocalBatch.mutate(
      {
        id_branch: Number(id_branch),
      },
      {
        onSuccess: (data) => {
          console.log("Inserted IDs:", data);
          Alert.alert("Success", "Request for return products accepted");
          router.push("/(admin)/profile");
        },
        onError: (error) => {
          console.error("Error inserting pending products:", error);
        },
      }
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleInsertPendingProducts}>
              <Text style={styles.confirmText}>Accept</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {products && products.length > 0 ? (
          <>
            <View style={styles.headerContainer}>
              <Text style={[styles.headerText, styles.statusHeader]}>
                Product
              </Text>

              <Text style={[styles.headerText, styles.moreInfoHeader]}>
                Quantity
                <Text style={[styles.headerText, styles.moreInfoHeaderBefore]}>
                  {" "}
                  Before
                </Text>
              </Text>
              <Text style={[styles.headerText, styles.moreInfoHeaderAfter]}>
                After
              </Text>
            </View>

            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id_products.toString()}
            />

            <View style={styles.footer}>
              <View style={styles.border}>
                <View style={styles.totalQuantitiesContainer}>
                  <Text style={styles.totalQuantities}>
                    Total Quantities Return
                  </Text>
                  <Text style={styles.totalQuantitiesText}>
                    {totalQuantity} pcs.
                  </Text>
                </View>
                <View style={styles.totalQuantitiesContainer}>
                  <Text style={styles.totalQuantities}>Total Cash Return</Text>
                  <Text style={styles.totalQuantitiesText}>₱ {cashCount}</Text>
                </View>
                <View style={styles.totalQuantitiesContainer}>
                  <Text style={styles.totalQuantities}>Total Sales</Text>
                  <Text style={styles.totalQuantitiesText}>₱ {totalSales}</Text>
                </View>
                <View style={styles.totalQuantitiesContainer}>
                  <Text style={styles.totalQuantities}>Total Voided Sales</Text>
                  <Text style={styles.totalQuantitiesText}>
                    ₱ {totalVoidedSales}
                  </Text>
                </View>
                <View style={styles.totalQuantitiesContainer}>
                  <Text style={styles.totalQuantities}>Created By</Text>
                  <Text style={styles.created_by}>{created_by}</Text>
                </View>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleTransaction}
                >
                  <Text style={styles.buttonText}>SALES </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCashCount}
                >
                  <Text style={styles.buttonText}>CASH COUNT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>OFFLINE</Text>
          </View>
        )}
      </View>
    </>
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
    flex: 2,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1.5,
    color: "gray",
  },
  moreInfoHeaderAfter: {
    textAlign: "right",
    flex: 0.5,
    // paddingLeft: 10,
  },
  moreInfoHeaderBefore: {
    textAlign: "right",
    flex: 0.5,
    color: "black",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // height: 50,
    paddingVertical: 10,
    borderBottomWidth: 2,
    paddingBottom: 20,
    borderBottomColor: "#ccc",
  },
  placeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.5,
  },
  statusCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  grayCircle: {
    backgroundColor: "gray",
  },
  greenCircle: {
    backgroundColor: "green",
  },
  itemText: {
    fontSize: 18,
    color: "#333",
    flex: 1,
    borderRadius: 5,
    borderStyle: "solid",
    borderWidth: 1,
    // flex: 1,
  },
  itemQuantity: {
    fontSize: 18,
    color: "#333",
    // flexDirection: "row",
    // flex: 1,
  },
  lowStock: {
    fontSize: 10,
    flex: 1,
    //to be fixed
    textAlign: "left",
    color: "darkred",
  },
  detailsText: {
    fontSize: 18,
    flex: 1,
    textAlign: "right",
  },
  grayText: {
    color: "gray",
  },
  blueText: {
    color: "#007AFF",
  },
  totalQuantitiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
    // borderRadius: 5,
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderColor: "red",
  },
  border: {
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: Colors.light.tint,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5, // For Android shadow
  },
  totalQuantities: {
    fontSize: 17,
    fontWeight: "bold",
    color: "gray",
  },
  totalQuantitiesText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
  },
  View: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  offlineContainer: {
    flex: 1,
    marginTop: "50%",
    alignItems: "center",
  },
  offlineText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "gray",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    aspectRatio: 5.5,
  },
  confirmText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  created_by: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
});

export default Details;
