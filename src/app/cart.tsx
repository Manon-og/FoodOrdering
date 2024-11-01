import React from "react";
import { View, Text, Platform, FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UseCart } from "@/src/providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import { useBranchName } from "@/components/branchParams";
import { useUserTransferQuantity } from "@/src/api/products";

const CartScreen = () => {
  const { items, total } = UseCart();
  const { id_branch, branchName } = useBranchName();
  const { mutate: transferQuantity } = useUserTransferQuantity();

  console.log("newPET!:", id_branch);
  const roundedTotal = parseFloat(total.toFixed(2));

  console.log("PET#:", roundedTotal);

  console.log(
    "PET:",
    items.map((item) => item.quantity)
  );
  console.log("PET@:", items);

  const handleCheckout = () => {
    items.forEach((item) => {
      transferQuantity({
        id_branch: Number(id_branch),
        id_products: item.id_products,
        quantity: item.quantity,
        amount: roundedTotal,
      });
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
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
    paddingBottom: 1,
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
