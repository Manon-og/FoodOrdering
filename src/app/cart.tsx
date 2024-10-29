import React from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { UseCart } from "@/src/providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";

const CartScreen = () => {
  const { items, total } = UseCart();
  const roundedTotal = parseFloat(total.toFixed(2));

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{roundedTotal}</Text>
        <Button text="Checkout" />
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
