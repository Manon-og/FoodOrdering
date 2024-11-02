import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  useBranchAllProductList,
  useBranchName,
  useTransferQuantity,
  useBackInventoryProductList,
} from "@/src/api/products"; // Adjust the import path accordingly
import Button from "@/src/components/Button"; // Adjust the import path accordingly
import RestockModal from "@/src/modals/restockModals"; // Adjust the import path accordingly

const Details = () => {
  const { id_branch } = useLocalSearchParams();
  const { data: products } = useBranchAllProductList(id_branch.toString());
  const { data: branch } = useBranchName(Number(id_branch));
  const { data: backInventoryProducts } = useBackInventoryProductList(
    id_branch.toString()
  );
  const { mutate: transferQuantity } = useTransferQuantity();
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [restockModalVisible, setRestockModalVisible] = useState(false);
  const [restockQuantities, setRestockQuantities] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (products && backInventoryProducts) {
      const lowStock = products.filter((item: any) => item.quantity < 15);
      setLowStockItems(lowStock);
      const initialQuantities = products.reduce((acc: any, item: any) => {
        acc[item.id_products] = lowStock.length > 0 ? 30 : 0; // Set initial quantity to 30 for low stock items, otherwise 0
        return acc;
      }, {});
      setRestockQuantities(initialQuantities as { [key: string]: number });
    }
  }, [products, backInventoryProducts]);

  useEffect(() => {
    if (products) {
      const filtered = products.filter((item: any) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory
          ? item.category.categoryName === selectedCategory
          : true;
        return matchesSearch && matchesCategory;
      });
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery, selectedCategory]);

  const handleRestock = () => {
    Alert.alert(
      "Confirm Restock",
      "Are you sure you want to restock these items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            Object.entries(restockQuantities).forEach(
              ([id_products, quantity]) => {
                transferQuantity({
                  id_branch: Number(id_branch),
                  id_products: Number(id_products),
                  quantity,
                });
              }
            );
            Alert.alert("Restock Successful", "The items have been restocked.");
            setRestockModalVisible(false);
          },
        },
      ]
    );
  };

  const handleQuantityChange = (id_products: string, quantity: string) => {
    setRestockQuantities((prev) => ({
      ...prev,
      [id_products]: parseInt(quantity) || 0,
    }));
  };

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
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Picker
              selectedValue={selectedCategory}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item label="All Categories" value="" />
              {products &&
                [
                  ...new Set(
                    products.map((item: any) => item.category.categoryName)
                  ),
                ].map((category) => (
                  <Picker.Item
                    key={category}
                    label={category}
                    value={category}
                  />
                ))}
            </Picker>
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
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={(item: any) =>
              item.id_products?.toString() || item.id.toString()
            }
          />
          <View style={styles.totalQuantitiesContainer}>
            <Text style={styles.totalQuantitiesText}>
              Total Quantities: {totalQuantity}
            </Text>
          </View>
          <Button
            text="Restock"
            onPress={() => setRestockModalVisible(true)}
            style={styles.restockButton}
          />
        </>
      ) : (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>OFFLINE</Text>
        </View>
      )}

      <RestockModal
        visible={restockModalVisible}
        lowStockItems={lowStockItems}
        allItems={
          products?.map((product: any) => ({
            ...product,
            backInventoryQuantity:
              (
                backInventoryProducts?.find(
                  (item: any) => item.id_products === product.id_products
                ) as { quantity: number } | undefined
              )?.quantity || 0,
          })) || []
        }
        restockQuantities={restockQuantities}
        onQuantityChange={handleQuantityChange}
        onCancel={() => setRestockModalVisible(false)}
        onConfirm={handleRestock}
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
  restockButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  restockButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  picker: {
    height: 40,
    flex: 1,
  },
});

export default Details;
