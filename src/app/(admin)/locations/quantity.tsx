import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  useTransferQuantity,
  useProductList,
  useSetTransferQuantity,
  useTransferBackInventoryProductList,
  useInsertProductionHistory,
  useAllProductList,
  useCategoryForProductTransfer,
  useGetNotification,
  useInsertNotification,
  useCategory,
} from "@/src/api/products";
import QuantityModal from "@/src/modals/quantityModals";
import { useBranchName } from "@/components/branchParams";
import QuantityTransfer from "@/components/QuantityTransfer";
import uuid from "react-native-uuid";

const Index = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [Date, setDate] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [inputQuantity, setInputQuantity] = useState<string>("");

  const category = useCategory();
  console.log("CATEGORYLOCAIRION:", category);
  const { data: allProducts } = useAllProductList();
  const { data: products } = useProductList(selectedCategory);
  const { data: availQuantity } = useTransferBackInventoryProductList();
  const { mutate: transferQuantity } = useSetTransferQuantity();
  const { mutate: insertProductionHistory } = useInsertProductionHistory();

  const { branchName, id_branch } = useBranchName();
  console.log("Branch Name HIRRRRRRRR@@:", branchName);
  console.log(" availQuantit:", availQuantity);
  console.log("products:", products);

  const combinedProducts = products?.map((product) => {
    const quantityData: any = availQuantity?.find(
      (item: any) => item.id_products === product.id_products
    );
    return {
      ...product,
      quantity: quantityData ? quantityData.quantity : 0,
    };
  });

  console.log("combinedProducts:", combinedProducts);
  console.log("productQuantities:", productQuantities);

  const handleOpenModal = (product: any) => {
    setCurrentProduct(product);
    setInputQuantity(productQuantities[product.id_products]?.toString() || ""); // Set input to the existing quantity
    setIsModalVisible(true);
  };

  const handleConfirmModal = () => {
    const quantity = parseInt(inputQuantity);
    const availableQuantity = currentProduct.quantity;

    if (isNaN(quantity)) {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProduct.id_products]: 0,
      }));
      setInputQuantity("0");
      setIsModalVisible(false);
      return;
    }

    if (quantity > availableQuantity) {
      Alert.alert(
        "Invalid Input",
        `The inputted quantity exceeds the available quantity of ${availableQuantity}.`
      );
      return;
    }

    // if (quantity > 100) {
    //   Alert.alert("Error", "Maximum input quantity is 100");
    //   return;
    // }

    if (quantity !== 0) {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProduct.id_products]: quantity,
      }));
      setIsModalVisible(false);
    } else {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProduct.id_products]: 0,
      }));
      setInputQuantity("0"); // Close the modal without updating if quantity is zero
      setIsModalVisible(false);
    }
  };

  const handleResetModal = () => {
    setProductQuantities((prev) => ({
      ...prev,
      [currentProduct.id_products]: 0,
    }));
    setInputQuantity("0");
    setIsModalVisible(false);
  };

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
        onPress: () => transferQuantitiesWithDate(),
      },
    ]);
  };

  const filteredProductList = Array.isArray(combinedProducts)
    ? combinedProducts.filter((item) => item.id_archive === 2)
    : [];

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => handleOpenModal(item)}
      style={[styles.productItem, item.quantity < 10 && styles.lowQuantity]}
    >
      <View style={styles.productRow}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.quantityInput}>
          Quantity Entered: {productQuantities[item.id_products] || 0}
        </Text>
      </View>
      <Text style={styles.quantityText}>
        Available Quantity: {item.quantity}
      </Text>
    </Pressable>
  );

  const { data: productTransfer } = useCategoryForProductTransfer();
  console.log("productTransfer:", productTransfer);

  const newData = productTransfer?.map((item: any) => {
    return item.id_products.id_category;
  });
  console.log("productTransferss:", newData);

  // const formatDateToLocalString = (date: any): string => {
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");
  //   return `${year}-${month}-${day}`;
  // };

  const currentDate = new Date().toLocaleDateString();
  const { data: notifications } = useGetNotification();
  const notification = useInsertNotification();

  const transferQuantitiesWithDate = () => {
    const hasNotificationForTodayAndBranch = notifications?.some(
      (notif: any) =>
        new Date(notif.created_at).toLocaleDateString() === currentDate &&
        notif.id_branch === id_branch
    );

    console.log("currentDate UP HEREE:", currentDate);
    console.log("NOTIFICATIONS", notifications);
    console.log("ID BRANCH", id_branch);

    if (!hasNotificationForTodayAndBranch) {
      notification.mutate(
        {
          title: `Set Cash Balance Reminder`,
          body: `${branchName} requires a cash balance update.`,
          id_branch: id_branch.toString(),
          type: "Location",
          branchName: branchName,
        },

        {
          onSuccess: (data) => {
            console.log("NOTIFICATION", data);
          },
          onError: (error) => {
            console.error("Error NOTIFICATION", error);
          },
        }
      );
    }

    const newIDgroup = uuid.v4();

    Object.entries(productQuantities).forEach(([id_products, quantity]) => {
      transferQuantity({
        id_branch: Number(id_branch),
        id_products: Number(id_products),
        quantity: quantity,
        id_group: newIDgroup,
      });
    });
    Object.entries(productQuantities).forEach(([id_products, quantity]) => {
      insertProductionHistory({
        location: branchName,
        id_products: id_products.toString(),
        quantity: quantity,
      });
    });
    Alert.alert(
      "Changes Confirmed",
      "You have successfully added the products"
    );
    router.push(
      `/(admin)/locations?id_branch=${id_branch}&branchName=${branchName}`
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Stack.Screen options={{ title: "Update Quantity" }} />
      <Stack.Screen
        options={{
          title: "Update Quantity",
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
        {/* <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("1")}
        >
          <Text style={styles.pressableText}>COOKIE</Text>
        </Pressable> */}
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
        name={currentProduct?.name}
      />
      {/* {Date && (
        <QuantityTransfer
          id_branch={Number(id_branch)}
          branchName={branchName}
          productQuantities={productQuantities}
          transferQuantity={transferQuantity}
          insertProductionHistory={insertProductionHistory}
        />
      )} */}
    </View>
  );
};
export default Index;

const styles = StyleSheet.create({
  productItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  lowQuantity: {
    backgroundColor: "#EA7D7E",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityInput: {
    fontSize: 14,
    color: "#333",
  },
  quantityText: {
    fontSize: 14,
    color: "#333",
  },
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
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 15,
  },
  // productRow: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // quantityInput: {
  //   marginLeft: 10,
  //   fontSize: 14,
  // },
  pressableText: {
    color: "lightblue",
    fontStyle: "italic",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  // productItem: {
  //   padding: 15,
  //   backgroundColor: "white",
  //   borderRadius: 10,
  //   marginVertical: 5,
  //   shadowColor: "black",
  //   shadowOpacity: 0.2,
  //   shadowRadius: 5,
  // },
  // productName: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  // },
  // quantityText: {
  //   marginTop: 5,
  //   fontSize: 14,
  // },
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
