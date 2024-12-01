import { StyleSheet, Image, Pressable } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { Link, useSegments } from "expo-router";
import React from "react";
import { useArchivedParams } from "./archivedParams";

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
    color: "red", // Red background when there is a warning
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
});
