import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import {
  useArchiveLocation,
  useBranchAllProductList,
  useBranchAllProductListInPendingProducts,
  useBranchName,
  useFindPendingProducts,
  useGetInitialCashCount,
  useGetInitialCashCountById,
  useInsertNotification,
} from "@/src/api/products"; // Adjust the import path accordingly
import ItemDetails from "@/components/ItemsDetails";
import Button from "@/components/Button";
import { useBranchStore } from "@/store/branch";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import SetInitialCashBalance from "@/modals/setInitialCashCount";
import useInitialCashCountChannel from "@/app/channel/useSetInitialCash";

const Details = () => {
  useInitialCashCountChannel(() => {
    dateOfInitialCashCountRefetch();
  });
  const [modalVisible, setModalVisible] = useState(false);
  const { id_branch, branchName } = useLocalSearchParams();
  const { data: products } = useBranchAllProductList(id_branch.toString());
  console.log("DETAILSds", id_branch);
  const { data: productsInPending } = useBranchAllProductListInPendingProducts(
    id_branch.toString()
  );

  console.log("DETAILSAPS", productsInPending);

  const { data: branch } = useBranchName(Number(id_branch));
  const [button, setButton] = useState(true);

  const notification = useInsertNotification();
  const hasMutated = useRef(false);

  console.log("HERE****", id_branch);
  console.log("HERE****?", products);
  console.log(
    "WTFDUDE",
    branch?.map((b: any) => b.id_archives)
  );
  let name = "";

  const branchId = Array.isArray(id_branch) ? id_branch[0] : id_branch;
  const { data: pendingProducts } = useFindPendingProducts(branchId);
  console.log("PENDING PRODUCTS", pendingProducts);

  const setBranchDataAdmin = useBranchStoreAdmin(
    (state) => state.setBranchDataAdmin
  );

  useEffect(() => {
    if (branch && branch.length > 0) {
      const branchName = branch[0].place;
      setBranchDataAdmin(id_branch, branchName);
    }
  }, [id_branch, branch, setBranchDataAdmin]);

  branch?.forEach((b: any) => {
    name = b.place;
  });

  const currentDate = new Date().toISOString().split("T")[0];

  const {
    data: dateOfInitialCashCount,
    refetch: dateOfInitialCashCountRefetch,
  } = useGetInitialCashCountById(id_branch.toString(), currentDate);

  console.log("DATE OF s CASH COUNT", dateOfInitialCashCount);
  console.log("DATE OF s CASH COUsNT", dateOfInitialCashCountRefetch);
  // const currentInitialCashCounst1 = dateOfInitialCashCount?.map((item: any) => {
  //   const date = new Date(item.created_at);
  //   return date.toISOString().split("T")[0];
  // });
  // console.log("DATE OF INITIAL CASH COUNT", currentInitialCashCount1);

  // const currentInitialCashCount2 = dateOfInitialCashCount?.map(
  //   (item: any) => item.id_branch
  // );
  // console.log("ID OF INITIAL CASH COUNT", currentInitialCashCount2);
  // console.log("ID BRANCH", id_branch);

  // const formattedInitialCashCount = currentInitialCashCount1?.map(
  //   (dateString: string) => {
  //     const date = new Date(dateString);
  //     return date.toISOString().split("T")[0];
  //   }
  // );

  // console.log("FORMATTED DATE", currentInitialCashCount1);

  // console.log("CURRENT DATE", currentDate);

  // const isDateMatched1 = currentInitialCashCount1?.some(
  //   (item: string) => item === currentDate
  // );

  // console.log("IS DATE MATCHED 1", isDateMatched1);

  // useEffect(() => {
  //   setButton(true);
  //

  //   const isDateMatched2 = currentInitialCashCount2?.some(
  //     (item: string) => item.toString() === id_branch.toString()
  //   );

  //   console.log("IS DATE MATCHED 1", isDateMatched1);
  //   console.log("IS DATE MATCHED 2", isDateMatched2);

  //   if (isDateMatched1 && isDateMatched2) {
  //     setButton(false);
  //     console.log("BUTTON OFF", button);
  //   }
  // }, [formattedInitialCashCount, currentDate]);

  console.log("BUTTON", button);

  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const totalQuantity = products?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState<string>("");

  let filteredProducts =
    products?.filter((item: any) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const renderItem = ({ item }: any) => {
    return <ItemDetails item={item} />;
  };

  const router = useRouter();

  const handleAcceptReturn = () => {
    router.push("/(admin)/return");
  };

  const handleCash = () => {
    setModalVisible(true);
    dateOfInitialCashCountRefetch();
  };

  const archiveLocation = useArchiveLocation();

  const handlePress = () => {
    if (products?.length === 0) {
      archiveLocation.mutate(Number(id_branch));
      router.push("/(admin)/places");
      Alert.alert("Button Pressed", "You pressed the Archive button!");
    } else {
      Alert.alert("Error", "Cannot archive location with products");
    }
  };

  console.log("DETAILS", products?.length === 0 ? "Unarchive" : "Archive");

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Location" }} />
      <Stack.Screen
        options={{
          title: `${name}`,
          headerRight: () => (
            <Pressable onPress={handlePress}>
              {({ pressed }) => (
                <FontAwesome
                  size={16}
                  color={"darkred"}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                >
                  {(branch?.map((b: any) => b.id_archives) ?? []).includes(1)
                    ? "Unarchive"
                    : "Archive"}
                </FontAwesome>
              )}
            </Pressable>
          ),
        }}
      />
      {(productsInPending && productsInPending.length > 0) ||
      (products && products.length > 0) ? (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>{currentDay}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
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
            <Text style={[styles.headerText, styles.statusHeader]}>
              #Product
            </Text>
            <Text style={[styles.headerText, styles.moreInfoHeader]}>
              Quantity
            </Text>
          </View>

          <FlatList
            data={paginatedProducts}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id_products.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContainer}
          />

          <View style={styles.footer}>
            <Text style={styles.totalQuantitiesText}>
<<<<<<< HEAD
              Total Quantities: {totalQuantity}
            </Text>
=======
                Total Quantities: {totalQuantity}
              </Text>
>>>>>>> 9ca335d78cc94a6fc2cb99ce443c94567d7c89cc
            <View style={styles.totalQuantitiesContainer}>
              {!dateOfInitialCashCount ||
              dateOfInitialCashCount.length === 0 ? (
                <Button text={"Set Cash Balance"} onPress={handleCash} />
              ) : null}
<<<<<<< HEAD
            </View>

            <View>
=======
              <View>
>>>>>>> 9ca335d78cc94a6fc2cb99ce443c94567d7c89cc
              {pendingProducts && pendingProducts.length > 0 && (
                <Button text={"Accept Return"} onPress={handleAcceptReturn} />
              )}
            </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>OFFLINE</Text>
        </View>
      )}
      <SetInitialCashBalance
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        id_branch={id_branch}
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
    paddingTop: "25%",
  },
  dateContainer: {
    position: "absolute",
    top: 25,
    alignItems: "center",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
  dayText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0E1432",
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
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
  },
  itemQuantity: {
    fontSize: 18,
    color: "#333",
  },
  lowStock: {
    fontSize: 10,
    flex: 1,
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
    bottom: 0,
    textAlign: "left",
  },
  totalQuantitiesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
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
});

export default Details;
