import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Modal,
  TextInput,
  Button,
} from "react-native";
import React, { memo, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  useInsertBatch,
  useInsertProductionHistory,
  useProductList,
  useTransferBackInventoryProductList,
  useAllProductList,
  useCategory,
} from "@/src/api/products";
import QuantityModal from "@/src/modals/quantityModals";
import uuid from "react-native-uuid";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [inputQuantity, setInputQuantity] = useState<string>("");
  const router = useRouter();
  const idGroup = uuid.v4();

  const { data: products, error, isLoading } = useProductList(selectedCategory);
  const { data: allProducts } = useAllProductList();

  const { data: availQuantity } = useTransferBackInventoryProductList();
  const { mutate: insertBatch } = useInsertBatch();
  const { mutate: insertProductionHistory } = useInsertProductionHistory();
  console.log("CATEGORY PRODUCTS:", products);
  console.log("Selected Category:", selectedCategory);
  console.log("ALL PRODUCTS:", allProducts);

  const { data } = useCategory();
  console.log("CATEGORYsad:", data);
  const newData = data?.map((item) => {
    return item.id_category;
  });
  console.log("CATEGORYsde:", newData);

  const handleOpenModal = (productId: string) => {
    setCurrentProductId(productId);
    setInputQuantity(productQuantities[productId]?.toString() || ""); // Set input to the existing quantity
    setIsModalVisible(true);
  };
  //hi

  const combinedProducts = products?.map((product) => {
    const quantityData: any = availQuantity?.find(
      (item: any) => item.id_products === product.id_products
    );
    return {
      ...product,
      quantity: quantityData ? quantityData.quantity : 0,
    };
  });

  const handleConfirmModal = () => {
    const quantity = parseInt(inputQuantity);
    if (isNaN(quantity)) {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProductId as string]: 0,
      }));
      setInputQuantity("0");
      setIsModalVisible(false);
      return;
    }

    if (quantity > 100) {
      Alert.alert("Error", "Maximum input quantity is 100");
    } else if (quantity !== 0) {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProductId as string]: quantity,
      }));
      setIsModalVisible(false);
    } else {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProductId as string]: 0,
      }));
      setInputQuantity("0"); // Close the modal without updating if quantity is zero
      setIsModalVisible(false);
    }
  };

  // const handleResetModal = () => {
  //   setProductQuantities((prev) => ({
  //     ...prev,
  //     [currentProductId as string]: 0,
  //   }));
  //   setInputQuantity("0");
  // };

  const handleCloseModal = () => {
    if (inputQuantity) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to close without saving?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => setIsModalVisible(false),
          },
        ]
      );
    } else {
      setIsModalVisible(false);
    }
  };

  const handleSubmit = () => {
    // Filter out zero quantities
    const nonZeroQuantities = Object.entries(productQuantities).filter(
      ([, quantity]) => quantity > 0
    );

    if (nonZeroQuantities.length === 0) {
      Alert.alert("No Changes", "No products were updated.");
      return;
    }

    console.log("Products:", products); // Log the products array
    console.log("All Products:", allProducts); // Log all products array

    const filteredProducts = allProducts?.filter(
      (product) => productQuantities[product.id_products] > 0
    );

    console.log("Filtered Products:", filteredProducts);

    const summary = filteredProducts
      ?.map((product) => {
        const quantity = productQuantities[product.id_products] || 0;
        console.log(
          `id_products: ${product.id_products}, quantity: ${quantity}`
        );
        return `${product.name}: ${quantity}`;
      })
      .join("\n");

    Alert.alert("Confirm Changes", `You are adding:\n\n${summary}`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          Object.entries(productQuantities).forEach(
            ([id_products, quantity]) => {
              insertBatch({
                id_products: Number(id_products),
                quantity,
                idGroup,
              });
            }
          ),
            Object.entries(productQuantities).forEach(
              ([id_products, quantity]) => {
                insertProductionHistory({
                  location: "Back Inventory",
                  id_products: id_products.toString(),
                  quantity,
                });
              }
            );
          router.push("/(admin)");
          Alert.alert(
            "Changes Confirmed",
            "You have successfully added the products"
          );
        },
      },
    ]);
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const filteredProductList = Array.isArray(combinedProducts)
    ? combinedProducts.filter((item) => item.id_archive === 2)
    : [];

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => handleOpenModal(item.id_products)}
      style={styles.productItem}
    >
      <View style={styles.productRow}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.quantityInput}>
          Quantity Entered: {productQuantities[item.id_products] || 0}
        </Text>
      </View>
      <Text style={styles.quantityText}>Available Stocks: {item.quantity}</Text>
    </Pressable>
  );

  return (
    <View style={styles.screenContainer}>
      <Stack.Screen options={{ title: "Update Quantity" }} />
      <Stack.Screen
        options={{
          title: "Stock In Products",
          headerRight: () => (
            <Pressable onPress={handleSubmit}>
              {({ pressed }) => (
                <FontAwesome
                  name="check"
                  size={25}
                  color="green"
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <View style={styles.categoryContainer}>
        {newData?.includes(1) ? (
          <Pressable
            style={styles.pressable}
            onPress={() => setSelectedCategory("1")}
          >
            <Text style={styles.pressableText}>COOKIE</Text>
          </Pressable>
        ) : null}

        {newData?.includes(2) ? (
          <Pressable
            style={styles.pressable}
            onPress={() => setSelectedCategory("2")}
          >
            <Text style={styles.pressableText}>BREADS</Text>
          </Pressable>
        ) : null}

        {/* <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("2")}
        >
          <Text style={styles.pressableText}>BREADS</Text>
        </Pressable> */}

        {newData?.includes(3) ? (
          <Pressable
            style={styles.pressable}
            onPress={() => setSelectedCategory("3")}
          >
            <Text style={styles.pressableText}>CAKES</Text>
          </Pressable>
        ) : null}
        {/* <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("3")}
        >
          <Text style={styles.pressableText}>CAKES</Text>
        </Pressable> */}

        {newData?.includes(4) ? (
          <Pressable
            style={styles.pressable}
            onPress={() => setSelectedCategory("4")}
          >
            <Text style={styles.pressableText}>BENTO CAKES</Text>
          </Pressable>
        ) : null}
        {/* <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("4")}
        >
          <Text style={styles.pressableText}>BENTO CAKES</Text>
        </Pressable> */}
      </View>
      <FlatList
        data={filteredProductList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_products.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <QuantityModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        // onReset={handleResetModal}
        inputQuantity={inputQuantity}
        setInputQuantity={setInputQuantity}
        name={
          products?.find((item) => item.id_products === currentProductId)?.name
        }
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "white",
    shadowColor: "lightblue",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  pressable: {
    flex: 1,
    height: 50,
    backgroundColor: "#FDFDFD",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 15,
  },
  pressableText: {
    color: "#0E1432",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  productItem: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    marginTop: 5,
    fontSize: 14,
  },
  quantityInput: {
    marginLeft: 10,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    width: "100%",
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
