import React, { memo, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import {
  useGetNotification,
  useGroupedSalesTransaction,
  useGroupedSalesTransactionADMIN,
} from "@/src/api/products";
import GroupedSalesTransactionItem from "@/components/AdminGroupedSalesTransactionItem";
import { useBranchStoreAdmin } from "@/store/branchAdmin";
import AdminViewTransaction from "@/components/AdminViewTransaction";
import DropdownComponent from "@/components/DropDown";
import { Link, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const Index = () => {
  const filter = [
    { label: "Sales", value: "Sales" },
    { label: "Product Transfer", value: "Product Transfer" },
    { label: "Expired Products", value: "Expired Products" },
    { label: "Production", value: "Production" },
    { label: "Returned Products", value: "Returned Products" },
  ];
  const { id_branch, branchName } = useBranchStoreAdmin();
  console.log("ADMIN TRANSACTION:", id_branch);
  console.log("ADMIN TRANSACTION:", branchName);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const { data: groupedSales }: any = useGroupedSalesTransactionADMIN();
  console.log("GROUPED SALESs:", groupedSales);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminViewTransaction
        place={item.id_branch.place}
        id_branch={item.id_branch.id_branch}
        created_at={item.created_at}
        amount_by_product={item.amount_by_product}
        created_by={item.created_by}
      />
    );
  };

  const keyExtractor = (item: any) => {
    const date = new Date(item.created_at).toISOString().split("T")[0];
    return `${item.id_branch.id_branch}_${date}`;
  };

  const [title, setTitle] = useState("Back Inventory");
  const [hasNotification, setHasNotification] = useState(false);
  console.log("eqws:", title);

  const { data: notification } = useGetNotification();
  console.log("notificationUU:", notification);

  useEffect(() => {
    if (
      notification &&
      notification.some((notif) => notif.isRead === "false")
    ) {
      setHasNotification(true);
    } else {
      setHasNotification(false);
    }
  }, [notification]);

  useEffect(() => {
    setTitle(title);
  }, [title]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          // title: "Transaction",
          // headerShown: true,
          headerRight: () => (
            <Link href="/(admin)/notification" asChild>
              <Pressable style={styles.notificationIconContainer}>
                <FontAwesome
                  name="bell"
                  size={24}
                  color="#0E1432"
                  style={{ marginRight: 35.3 }}
                />
                {hasNotification && <View style={styles.notificationBadge} />}
              </Pressable>
            </Link>
          ),
        }}
      />
      <View>
        <DropdownComponent data={filter} />
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Location</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Date</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={groupedSales}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backButtonText: {
    color: "#0E1432",
    fontSize: 16,
  },
  notificationIconContainer: {
    position: "relative",
    // marginRight: 15,
  },
  notificationBadge: {
    position: "absolute",
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "darkred",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // paddingTop: "20%",
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
    fontSize: 15,
    textAlign: "left",
    flex: 1,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
  },
});

export default Index;
