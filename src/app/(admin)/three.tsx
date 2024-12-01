import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import {
  useExpiredProductsHistoru,
  useGetNotification,
} from "@/src/api/products";
import AdminViewExpiredHistory from "@/components/AdminViewExpiredHistory";
import DropdownComponent from "@/components/DropDown";
import { Link, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import useSupabaseChannel from "../channel/useSupabaseChannel";
import useExpiredProductsChannel from "../channel/useExpiredProductsChannel";

const Index = () => {
  useSupabaseChannel();
  useExpiredProductsChannel(() => {
    expiredProductsRefetch();
  });

  const filter = [
    { label: "Sales", value: "Sales" },
    { label: "Product Transfer", value: "Product Transfer" },
    { label: "Expired Products", value: "Expired Products" },
    { label: "Production", value: "Production" },
    { label: "Returned Products", value: "Returned Products" },
  ];

  const { data: expiredProducts, refetch: expiredProductsRefetch } =
    useExpiredProductsHistoru();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const [hasNotification, setHasNotification] = useState(false);
  const { data: notification } = useGetNotification();

  const filteredProducts =
    expiredProducts?.filter((item: any) =>
      item.id_products.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const MemoizedHistory = memo(AdminViewExpiredHistory);

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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <MemoizedHistory
        productName={item.id_products.name}
        quantity={item.quantity}
        potential_sales={item.potential_sales}
      />
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Expired Products",
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

      <DropdownComponent data={filter} />

      <TextInput
        style={styles.searchBar}
        placeholder="Search product..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Quantity</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Potential Sales
        </Text>
      </View>

      <FlatList
        data={paginatedProducts}
        //keyExtractor={(item: any) => item.id_products.id.toString()}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notificationIconContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: 35,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "darkred",
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
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
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
