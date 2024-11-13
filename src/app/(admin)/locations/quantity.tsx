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
} from "@/src/api/products";
import QuantityModal from "@/src/modals/quantityModals";
import { useBranchName } from "@/components/branchParams";
import QuantityTransfer from "@/components/QuantityTransfer";

const Index = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [productQuantities, setProductQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Date, setDate] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [inputQuantity, setInputQuantity] = useState<string>("");

  const { data: products, error, isLoading } = useProductList(selectedCategory);
  const { mutate: transferQuantity } = useSetTransferQuantity();

  const { branchName, id_branch } = useBranchName();

  const handleOpenModal = (productId: string) => {
    setCurrentProductId(productId);
    setInputQuantity(productQuantities[productId]?.toString() || ""); // Set input to the existing quantity
    setIsModalVisible(true);
  };

  const handleConfirmModal = () => {
    const quantity = parseInt(inputQuantity);
    if (quantity > 0) {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProductId as string]: quantity,
      }));
      setIsModalVisible(false);
    } else {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid quantity greater than 0."
      );
    }
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
    if (Object.keys(productQuantities).length === 0) {
      Alert.alert("No Changes", "No products were updated.");
      return;
    }

    console.log("Products:", products); // Log the products array

    const summary = products
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
        text: "Set Date",
        onPress: () => {
          setDate(true);
        },
      },
    ]);
  };

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

  const filteredProductList = Array.isArray(products)
    ? products.filter((item) => item.id_archive === 2)
    : [];

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => handleOpenModal(item.id_products)}
      style={styles.productItem}
    >
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.quantityText}>
        Available Quantity: {item.quantity}
      </Text>
    </Pressable>
  );

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
        <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("1")}
        >
          <Text style={styles.pressableText}>COOKIE</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("2")}
        >
          <Text style={styles.pressableText}>BREADS</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("3")}
        >
          <Text style={styles.pressableText}>CAKES</Text>
        </Pressable>
        <Pressable
          style={styles.pressable}
          onPress={() => setSelectedCategory("4")}
        >
          <Text style={styles.pressableText}>BENTO CAKES</Text>
        </Pressable>
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
        inputQuantity={inputQuantity}
        setInputQuantity={setInputQuantity}
      />
      {Date && (
        <QuantityTransfer
          id_branch={Number(id_branch)}
          productQuantities={productQuantities}
          transferQuantity={transferQuantity}
        />
      )}
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
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 15,
  },
  pressableText: {
    color: "lightblue",
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
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantityText: {
    marginTop: 5,
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
