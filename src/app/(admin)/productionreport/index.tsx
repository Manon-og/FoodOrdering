import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useGetProductionHistoryDetails } from "@/src/api/products";
import { Stack, useLocalSearchParams } from "expo-router";

import Colors from "@/constants/Colors";
import AdminViewProductionDetails from "@/components/AdminViewProductionDetails";

const Index = () => {
  const { created_at, location } = useLocalSearchParams();

  const { data: production } = useGetProductionHistoryDetails(
    location.toString(),
    created_at.toString()
  );

  console.log("Production History Details:", production);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminViewProductionDetails
        name={item.id_products.name}
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
      <FlatList data={production} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkgreen",
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
