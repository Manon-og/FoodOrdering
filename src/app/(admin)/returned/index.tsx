import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useBranchData,
  useGetPendingProducts,
  useLocalBranchData,
} from "@/src/api/products";
import ListItem from "@/src/components/listItem";
import { Link } from "expo-router";
import Button from "@/src/components/Button";
import GroupedReturnedItem from "@/components/AdminReturnReturnedProducts";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();

  console.log("Branch data:", branch);
  console.log("Local branch data:", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: pendingProducts } = useGetPendingProducts();
  console.log("Pending products??:", pendingProducts);

  const renderItem = ({ item }: { item: any }) => {
    const createdAtDate = item.created_at.split("T")[0];
    console.log("IDBRNch:", item.id_branch.id_branch);
    return (
      <GroupedReturnedItem
        item={item}
        id_branch={item.id_branch.id_branch}
        id_branch_place={item.id_branch_place}
        created_at={createdAtDate}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>From</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Date</Text>
      </View>
      <FlatList
        data={pendingProducts}
        renderItem={renderItem}
        // keyExtractor={(item) => item.returned_groupID} pede bani??
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
    paddingTop: "20%",
  },
  dateContainer: {
    position: "absolute",
    top: "2.5%",
  },
  dateText: {
    fontSize: 20,
    color: "gray",
    textAlign: "center",
  },
  dayText: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#0E1432",
    textAlign: "center",
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
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  statusHeader: {
    textAlign: "left",
    flex: 0.5,
    paddingLeft: "13%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
    paddingRight: 50,
  },
});

export default Index;
