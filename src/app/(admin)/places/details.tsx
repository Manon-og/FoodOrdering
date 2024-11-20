import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import {
  useArchiveLocation,
  useBranchAllProductList,
  useBranchName,
  useFindPendingProducts,
} from "@/src/api/products"; // Adjust the import path accordingly
import ItemDetails from "@/components/ItemsDetails";
import Button from "@/components/Button";
import { useBranchStore } from "@/store/branch";
import { useBranchStoreAdmin } from "@/store/branchAdmin";

const Details = () => {
  const { id_branch, branchName } = useLocalSearchParams();
  const { data: products } = useBranchAllProductList(id_branch.toString());
  const { data: branch } = useBranchName(Number(id_branch));
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

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const totalQuantity = products?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const renderItem = ({ item }: any) => {
    return <ItemDetails item={item} />;
  };

  const router = useRouter();

  const handleAcceptReturn = () => {
    router.push("/(admin)/return");
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
      {products && products.length > 0 ? (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>{currentDay}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
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
            data={products}
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id_products.toString()}
          />
          <View style={styles.footer}>
            <View style={styles.totalQuantitiesContainer}>
              <Text style={styles.totalQuantitiesText}>
                Total Quantities: {totalQuantity}
              </Text>
            </View>
            <View>
              {pendingProducts && pendingProducts.length > 0 && (
                <Button text={"Accept Return"} onPress={handleAcceptReturn} />
              )}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>OFFLINE</Text>
        </View>
      )}
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
    // position: "absolute",
    bottom: 20,
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
});

export default Details;
