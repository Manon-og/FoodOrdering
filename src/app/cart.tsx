import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { UseCart } from "@/src/providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { useBranchName } from "@/components/branchParams";
import { getUserFullName, useUserTransferQuantity } from "@/src/api/products";
import { FontAwesome } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import { useBranchStore } from "@/src/store/branch";

const CartScreen = () => {
  const {
    items,
    total,
    clearCart,
    removeItem,
    addItem,
    totalAmountPerProduct,
  } = UseCart();

  // const { id_branches, branchName } = useBranchName();
  const { mutate: transferQuantity } = useUserTransferQuantity();
  const router = useRouter();
  const { id_branch, branchName } = useBranchStore();
  // console.log("CART BUTTON:", id_branches);
  console.log("CART BUTTON:", id_branch);

  const roundedTotal = parseFloat(total.toFixed(2));
  const roundedTotalById = parseFloat(totalAmountPerProduct.toString());
  console.log("TOTALBYPRODUCT FUCK IT", totalAmountPerProduct);
  const transactionId = uuidv4();
  console.log("transactionId", transactionId);

  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const userName = await getUserFullName();
      setName(userName);
    };

    fetchUserName();
  }, []);

  console.log("name?", name);

  const handleCheckout = () => {
    Alert.alert("Confirm Order", "Are you sure you want to place this order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          const totalAmounts = Object.values(totalAmountPerProduct);
          items.forEach((item, index) => {
            console.log("??????????????????????", item);
            transferQuantity({
              id_localbranch: item.id_localbranch,
              id_branch: Number(id_branch),
              id_products: item.id_products,
              quantity: item.quantity,
              amount: roundedTotal,
              created_by: name || "",
              id_group: transactionId,
              amount_by_product: totalAmounts[index],
            });
          });
          setTimeout(() => {
            clearCart();
            Alert.alert(
              "Order Successful",
              "Your order has been placed successfully."
            );
            router.push(
              `/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`
            );
          }, 1000);
        },
      },
    ]);
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from the cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            removeItem(itemId);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddMoreProducts = () => {
    router.push(
      `/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[...items, { id: "add-more", type: "placeholder" }]}
        renderItem={({ item }) => {
          if (item.type === "placeholder") {
            return (
              <Pressable
                style={styles.addMoreContainer}
                onPress={handleAddMoreProducts}
              >
                <FontAwesome name="plus" size={24} color="gray" />
                <Text style={styles.addMoreText}>Add More To Cart</Text>
              </Pressable>
            );
          }
          return (
            <CartListItem
              cartItem={item}
              onRemove={() => handleRemoveItem(item.id)}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{roundedTotal}</Text>
        <Button text="Checkout" onPress={handleCheckout} />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContent: {
    paddingBottom: 100, // Ensure there's space for the footer
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginVertical: 2,
  },
  addMoreText: {
    marginLeft: 10,
    fontSize: 16,
    color: "gray",
  },
});

export default CartScreen;
