import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { useBranchAllProductList, useBranchName } from "@/src/api/products"; // Adjust the import path accordingly

const Details = () => {
  const { id_branch } = useLocalSearchParams();
  const { data: products } = useBranchAllProductList(id_branch.toString());
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
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>
          {item.category.categoryName}: {item.name}
        </Text>
        <Text style={styles.lowStock}>
          {item.quantity <= 10 ? "low stock" : ""}
        </Text>
        <Text style={styles.itemText}> {item.quantity}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Location" }} />
      <Stack.Screen
        options={{
          title: `${name}`,
          headerRight: () => (
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  size={16}
                  color={"darkred"}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                >
                  Archive
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
          <View style={styles.totalQuantitiesContainer}>
            <Text style={styles.totalQuantitiesText}>
              Total Quantities: {totalQuantity}
            </Text>
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
    position: "absolute",
    bottom: 20,
    left: 20,
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
});

export default Details;
