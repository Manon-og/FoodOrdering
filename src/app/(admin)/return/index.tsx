import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { useBranchAllProductList, useBranchName } from "@/src/api/products"; // Adjust the import path accordingly

import { useBranchStoreAdmin } from "@/store/branchAdmin";
import ItemDetailsReturn from "@/components/ItemsDetailsReturn";
import Colors from "@/constants/Colors";

const Details = () => {
  const { id_branch, branchName } = useBranchStoreAdmin();
  console.log("ADMIN RETURN:", id_branch);
  console.log("ADMIN RETURN:", branchName);
  const { data: products } = useBranchAllProductList(
    id_branch?.toString() ?? ""
  );
  const { data: branch } = useBranchName(Number(id_branch));
  console.log("HERE****", id_branch);
  console.log("HERE****?", products);
  console.log("WTFDUDE", branch);
  let name = "";

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
    return <ItemDetailsReturn item={item} />;
  };

  const router = useRouter();

  const handleTransaction = () => {
    router.push("/(admin)/transactions/mainview");
  };

  const handleCashCount = () => {
    router.push("/(admin)/cashcount");
  };

  return (
    <View style={styles.container}>
      {products && products.length > 0 ? (
        <>
          <View style={styles.dateContainer}>
            <Text style={styles.dayText}>{currentDay}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
          </View>
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
            <View style={styles.totalQuantitiesContainer}>
              <Text style={styles.totalQuantitiesText}>Total Quantities</Text>
              <Text style={styles.totalQuantitiesText}>
                Before: {totalQuantity}
              </Text>
              <Text style={styles.totalQuantitiesText}>
                After: {totalQuantity}
              </Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleTransaction}
              >
                <Text style={styles.buttonText}>SALES TRANSACTIONS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCashCount}>
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
    paddingTop: "30%",
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
    bottom: 20,
    textAlign: "left",
  },
  totalQuantitiesText: {
    paddingLeft: 20,
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
  buttonRow: {
    flexDirection: "row",

    // justifyContent: "flex-start", // Adjust as needed
    // alignItems: "flex-start", // Adjust as needed
  },
});

export default Details;
