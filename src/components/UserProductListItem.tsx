import { StyleSheet, Image, Pressable, Alert } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { Link, useSegments } from "expo-router";
import React, { useState } from "react";
import { useArchivedParams } from "./archivedParams";
import { UseCart } from "@/src/providers/CartProvider";
import { FontAwesome } from "@expo/vector-icons";
import { useLimitQuantity } from "@/api/products";
import { useBranchStore } from "@/store/branch";

type ProductListItemProps = {
  product: {
    id: string;
    name: string;
    image: string;
    price: {
      amount: number;
    };
  };
  amount: number;
};

export const DefaultPhoto =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

const ProductListItem = ({ product }: any) => {
  const segments = useSegments();
  const { id_archive } = useArchivedParams();
  const hrefLink: any = `/${segments[0]}/menu/${product.id_products}?id_archive=1&id_branch=${product.id_branch.id_branch}`;

  const warning = product.quantity <= 10 ? "Low Stocks!" : "";

  // Conditionally set background color based on the presence of a warning
  const containerStyle = warning ? styles.containerWarning : styles.container;
  const { id_branch, branchName } = useBranchStore();
  const { data: limitedQuantity } = useLimitQuantity(id_branch);
  console.log("LIMIT QUANTIsTsY:", limitedQuantity);

  const productLimit =
    limitedQuantity?.find(
      (item: any) => item.id_products === product.id_products
    )?.quantity || 0;
  console.log("PRODUCT LIMIT:", productLimit);

  const { addItem } = UseCart();
  const [quantity, setQuantity] = useState(0);

  const incrementQuantity = () => {
    if (quantity >= productLimit) {
      Alert.alert("Limit Quantity", "You have reached the limit quantity", [
        { text: "Ok", style: "cancel" },
      ]);
    } else {
      setQuantity(quantity + 1);
      addItem(product); // Automatically add to cart when incrementing
    }
  };

  return (
    <Link href={hrefLink} asChild>
      <Pressable style={containerStyle}>
        <View style={styles.insideContainer}>
          <Image
            style={styles.image}
            source={{ uri: product.image || DefaultPhoto }}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price3}>
              Available Stocks:{" "}
              <Text style={styles.price1}>{product.quantity}pcs.</Text>
            </Text>
          </View>
          {warning ? <Text style={styles.warning}>{warning}</Text> : null}
          <View style={styles.quantityContainer}>
            <Pressable
              style={styles.incrementButton}
              onPress={incrementQuantity}
            >
              {quantity > 0 ? (
                <Text style={styles.quantityText}>{quantity}</Text>
              ) : (
                <FontAwesome name="plus" size={15} color="white" />
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    width: "100%",
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
    position: "relative", // Ensure the warning text is positioned relative to this container
  },
  containerWarning: {
    backgroundColor: "lightcoral", // Red background when there is a warning
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    width: "100%",
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
    position: "relative", // Ensure the warning text is positioned relative to this container
  },
  insideContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 7,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1A1E25",
  },
  price3: {
    fontSize: 13,
    color: "gray",
    fontWeight: "bold",
  },
  price1: {
    fontSize: 15,
    color: "darkgreen",
    fontWeight: "bold",
  },
  warning: {
    fontSize: 14,
    color: "darkred",
    fontWeight: "bold",
    position: "absolute", // Position the warning text absolutely within the container
    top: 5, // Distance from the top of the container
    right: 10, // Distance from the right of the container
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  incrementButton: {
    backgroundColor: "darkgreen",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
