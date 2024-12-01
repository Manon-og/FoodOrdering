import { FontAwesome } from "@expo/vector-icons";
import { router, Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
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
import { useCashStore } from "@/store/cashcountAdmin";
import { useSalesStore } from "@/store/totalSalesAdmin";
import { useVoidedSalesStore } from "@/store/totalVoidedSalesAdmin";
import { useUUIDStore } from "@/store/user";
import { useIdGroupStore } from "@/store/idgroup";
import ItemDetailsReturn from "@/components/ItemsDetailsReturn";
import ItemExpireDetailsReturn from "@/components/ItemsDetailsReturn";
import ViewCommentModal from "@/modals/viewCommentModals";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const Details = ({ ddd }: any) => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: products } = useBranchAllProductList(
    id_branch?.toString() ?? ""
  );

  console.log("LEMEE SEEE", products);
  const { data: branch } = useBranchName(Number(id_branch));

  let name = "";

  branch?.forEach((b: any) => {
    name = b.place;
  });

  const date = new Date();
  console.log("RETURN date:", date);

  const { data: salesReport }: any = useGroupedSalesReport(
    id_branch?.toString(),
    date
  );

  const date2 = new Date().toISOString().split("T")[0];
  console.log("RETURN date2:", date2);

  const { data: cashcount } = useGetCashCount(
    id_branch ? id_branch.toString() : "",
    date2.toString()
  );

  console.log("RETURN cashcount++:", cashcount);

  const TOTALCASHCOUNT = cashcount?.map((item: any) => item.total);
  console.log("RETURN TOTALCASHCOUNT:", TOTALCASHCOUNT);

  // const cashCountData = cashcount && cashcount.length > 0 ? cashcount[0] : {};
  // const cashCount = cashcount?.total;

  const { data: comments } = useGetComment(id_branch?.toString(), date2);
  console.log("RETURN comments:", comments);
  const realComment = comments?.map((item: any) => item.comment);

  const { data: dateOfInitialCashCount } = useGetInitialCashCount();
  console.log("dateOfInitialCashCount", dateOfInitialCashCount);

  const currentInitialCashCount1 = dateOfInitialCashCount?.map(
    (item: any) => item.created_at
  );
  console.log("DATE OF INITIAL CASH COUNT", currentInitialCashCount1);

  const formattedInitialCashCount = currentInitialCashCount1?.map(
    (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    }
  );
  console.log("FORMATTED DATE", formattedInitialCashCount);

  const currentDate = new Date().toISOString().split("T")[0];
  console.log("CURRENT DATE", currentDate);

  const isDateMatched1 = formattedInitialCashCount?.some(
    (item: string) => item === currentDate
  );
  console.log("TRUE?", isDateMatched1);

  let cashValue = 0;
  if (isDateMatched1) {
    const matchingItem = dateOfInitialCashCount?.find(
      (item: any) =>
        new Date(item.created_at).toISOString().split("T")[0] === currentDate
    );
    cashValue = matchingItem?.cash;
  }
  console.log("CASH VALUE_", cashValue);

  console.log("RETURN salesReport:", salesReport);
  const created_by = salesReport?.map((item: any) => item.created_by);

  // console.log("RETURN created_by:", created_by[0]);

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  let filteredProducts = products?.filter((item: any) => []) ?? [];

  const totalPages = Math.ceil((filteredProducts?.length ?? 0) / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: any) => {
    console.log("EXPIRE", item.expiry_date);
    const date = new Date(item.expiry_date);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const newDateString = `${year}-${month}-${day}`;
    console.log("NEW EXPIRE", newDateString);
    return (
      <ItemExpireDetailsReturn
        item={item}
        expiry={newDateString}
        id_batch={item.id_batch}
        id_branch={id_branch}
      />
    );
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

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleInsertPendingProducts = () => {
    setIsButtonDisabled(true);
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
              onPress={handleInsertPendingProducts}
              disabled={isButtonDisabled}
            >
              <Text
                style={[
                  styles.confirmText,
                  isButtonDisabled && styles.disabledText,
                ]}
              >
                ACCEPT
              </Text>
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
                Qty
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
              data={paginatedProducts}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id_products.toString()}
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
                  <Text style={styles.totalQuantitiesText}>
                    ₱ {TOTALCASHCOUNT}
                  </Text>
                </View>
                <View style={styles.totalQuantitiesContainer}>
                  <Text style={styles.totalQuantities}>
                    Beginning Cash Balance
                  </Text>
                  <Text style={styles.totalQuantitiesText}>₱ {cashValue}</Text>
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
                  <Text style={styles.buttonText}>View Sales </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.buttonText}>View Comment </Text>
                </TouchableOpacity>
                <ViewCommentModal
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  comment={realComment}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCashCount}
                >
                  <Text style={styles.buttonText}>View Cash Count</Text>
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
    backgroundColor: "#0E1432",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
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
    paddingLeft: "5%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1.5,
    color: "black",
  },
  moreInfoHeaderAfter: {
    textAlign: "right",
    flex: 0.5,
    color: "gray",
    // paddingLeft: 10,
  },
  moreInfoHeaderBefore: {
    textAlign: "right",
    flex: 0.5,
    color: "gray",
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
    borderWidth: 0,
    borderColor: Colors.light.tint,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingLeft: 10,
  },
  confirmText: {
    color: "green",
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 10,
    letterSpacing: 1,
  },
  disabledText: {
    color: "gray",
  },
  created_by: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.light.tint,
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
  flatListContainer: {
    paddingBottom: 20,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
});

export default Details;
