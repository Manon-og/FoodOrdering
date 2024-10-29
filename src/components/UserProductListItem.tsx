import { StyleSheet, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { Product } from "@/src/types";
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
  console.log("ID ARCHIVE??????????:", id_archive);
  const hrefLink = id_archive
    ? `/${segments[0]}/menu/create?id=${product.id_products}&id_archive=1`
    : `/${segments[0]}/menu/${product.id_products}`;

  const warning = product.quantity <= 10 ? "Low Stocks!" : "";

  return (
    <Link href={hrefLink} asChild>
      <Pressable style={styles.container}>
        <View style={styles.insideContainer}>
          <Image
            style={styles.image}
            source={{ uri: product.image || DefaultPhoto }}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price3}>
              Available Stocks:{" "}
              <Text style={styles.price1}>{product.quantity}pcs.</Text>{" "}
            </Text>

            <Text style={styles.warning}> {warning}</Text>
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
  },
  insideContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  price: {
    fontSize: 10,
    color: "gray",
    fontWeight: "bold",
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
  price2: {
    fontSize: 10,
    color: "green",
    fontWeight: "bold",
  },
  warning: {
    fontSize: 10,
    color: "darkred",
    fontWeight: "bold",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
