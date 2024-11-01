import React from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { UseCart } from "@/src/providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { useBranchName } from "@/components/branchParams";
import { useUserTransferQuantity } from "@/src/api/products";

const CartScreen = () => {
  const { items, total, clearCart, removeItem } = UseCart();
  const { id_branch, branchName } = useBranchName();
  const { mutate: transferQuantity } = useUserTransferQuantity();
  const router = useRouter();

  const roundedTotal = parseFloat(total.toFixed(2));

  const handleCheckout = () => {
    Alert.alert("Confirm Order", "Are you sure you want to place this order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          items.forEach((item) => {
            transferQuantity({
              id_branch: Number(id_branch),
              id_products: item.id_products,
              quantity: item.quantity,
              amount: item.product.id_price.amount,
            });
          });
          setTimeout(() => {
            clearCart();
            Alert.alert(
              "Order Successful",
              "Your order has been placed successfully."
            );
            router.push("/(user)/category/");
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

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartListItem
            cartItem={item}
            onRemove={() => handleRemoveItem(item.id)}
          />
        )}
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
});

export default CartScreen;
