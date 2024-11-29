import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useBranchData,
  useGetNotification,
  useGetPendingProducts,
  useLocalBranchData,
} from "@/src/api/products";
import ListItem from "@/src/components/listItem";
import { Link } from "expo-router";
import Button from "@/src/components/Button";
import GroupedReturnedItem from "@/components/AdminReturnReturnedProducts";
import AdminViewNotification from "@/components/AdminViewNotification";

const Index = () => {
  const { data: notification } = useGetNotification();
  const MemoizedProductListItem = memo(AdminViewNotification);

  const sortedNotifications = notification?.sort(
    (a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const renderItem = ({ item }: { item: any }) => {
    return (
      <MemoizedProductListItem
        title={item.title}
        body={item.body}
        time={item.created_at}
        viewed={item.isRead}
        navigateTo={item.type}
        branchName={item.branchName}
        item={item}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_notification.toString()}
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
    // paddingTop: "20%",
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
