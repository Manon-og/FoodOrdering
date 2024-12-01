import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import {
  useGetNotification,
  useReturnedProductHistory,
} from "@/src/api/products";
import AdminReturnReturnedProductsHistory from "@/components/AdminViewReturnedProductsHistory";
import { Link, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import DropdownComponent from "@/components/DropDown";
import useReturnedProductChannel from "../channel/useReturnedProductChannel";

const Index = () => {
  useReturnedProductChannel(() => {
    reFetchReturnedProduct();
  });
  const filter = [
    { label: "Sales", value: "Sales" },
    { label: "Product Transfer", value: "Product Transfer" },
    { label: "Expired Products", value: "Expired Products" },
    { label: "Production", value: "Production" },
    { label: "Returned Products", value: "Returned Products" },
  ];

  const { data: returnedHistory, refetch: reFetchReturnedProduct } =
    useReturnedProductHistory();
  console.log("Returned History!:", returnedHistory);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState<string>("");

  let filteredReturnedHistory =
    returnedHistory?.filter((item: any) =>
      item.from.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredReturnedHistory.length / itemsPerPage);
  const paginatedReturnedHistory = filteredReturnedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <AdminReturnReturnedProductsHistory
        from={item.from}
        to={item.to}
        quantity={item.quantity}
        date={item.created_at}
      />
    );
  };

  const keyExtractor = (item: any) => {
    return item.id_products?.id_products?.toString() || item.id.toString();
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
          title: "Transaction",
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
      <TextInput
        style={styles.searchBar}
        placeholder="Search by From location..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>From</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>To</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>Date</Text>
      </View>
      <FlatList
        data={paginatedReturnedHistory}
        //keyExtractor={keyExtractor}
        renderItem={renderItem}
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
    right: 35,
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
    paddingLeft: "10%",
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
    paddingRight: "8%",
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
    paddingRight: "13%",
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
});

export default Index;
