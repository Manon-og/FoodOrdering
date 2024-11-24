import { StyleSheet, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { Product } from "@/src/types";
import { Link, useSegments } from "expo-router";
import React, { useEffect } from "react";
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

const ProductListItem = ({ product, productsByBackInventory }: any) => {
  const segments = useSegments();
  const { id_archive } = useArchivedParams();
  const { id_branch, branchName } = useBranchName();
  console.log("ID BRANCH#######", id_branch);
  console.log("ID ARCHIVE??????????:", id_archive);
  console.log("productsByBackInventory", productsByBackInventory);
  console.log("PRODUCTS,", product);

  useEffect(() => {
    productsByBackInventory;
  }, [productsByBackInventory]);

  const backInventoryProduct = productsByBackInventory?.find(
    (item: { id_products: any }) => item.id_products === product.id_products
  );
  const backInventoryQuantity = backInventoryProduct
    ? backInventoryProduct.quantity
    : 0;

  const hrefLink = id_archive
    ? `/${segments[0]}/menu/create?id=${product.id_products}&id_archive=1`
    : `/${segments[0]}/menu/${product.id_products}`;
  const newHrefLink: any = id_branch ? `/${segments[0]}/menu/` : hrefLink;

  const warning = product.quantity <= 10 ? "Low Stocks!" : "";

  const content = (
    <Pressable style={styles.container}>
      <View style={styles.insideContainer}>
        <Image
          style={styles.image}
          source={{ uri: product.image || DefaultPhoto }}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{product.name}</Text>
          <View style={styles.row}>
            <Text style={styles.price3}>
              Available Stocks:{" "}
              <Text style={styles.price1}>
                {id_branch ? product.quantity : backInventoryQuantity}pcs.
              </Text>{" "}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.price}>
              {id_branch ? "Back Inventory" : "Total"} Stocks:{" "}
              <Text style={styles.price2}>
                {id_branch ? backInventoryQuantity : product.quantity}pcs.
              </Text>{" "}
            </Text>
          </View>
          <Text style={styles.warning}> {warning}</Text>
        </View>
      </View>
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
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    width: "100%",
    borderRadius: 7,
  },
  insideContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 7,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0E1432",
  },
  price: {
    fontSize: 13,
    color: "#393939",
    fontWeight: "bold",
    flex: 1,
  },
  price3: {
    fontSize: 14,
    color: "#393939",
    fontWeight: "bold",
    flex: 1,
  },
  price1: {
    fontSize: 14,
    color: "darkgreen",
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  price2: {
    fontSize: 13,
    color: "green",
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
  },
  warning: {
    fontSize: 12,
    color: "darkred",
    fontWeight: "bold",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
