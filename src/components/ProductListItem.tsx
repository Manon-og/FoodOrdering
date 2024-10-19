import { StyleSheet, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { Product } from "@/src/types";
import { Link, useSegments } from "expo-router";
import React from "react";
import { useArchivedParams } from "./archivedParams";
import { useBranchName } from "./branchParams";

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
  const { id_branch, branchName } = useBranchName();
  console.log("ID BRANCH#######", id_branch);
  console.log("ID ARCHIVE??????????:", id_archive);
  const hrefLink = id_archive
    ? `/${segments[0]}/menu/create?id=${product.id_products}&id_archive=1`
    : `/${segments[0]}/menu/${product.id_products}`;
  const newHrefLink = id_branch ? `/${segments[0]}/menu/` : hrefLink;

  const content = (
    <Pressable style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: product.image || DefaultPhoto }}
        resizeMode="contain"
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Total Stocks: {product.quantity}</Text>
    </Pressable>
  );

  return id_branch ? (
    content
  ) : (
    <Link href={newHrefLink} asChild>
      {content}
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  price: {
    fontSize: 10,
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
