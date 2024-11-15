import React, { memo, useEffect } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
import { useProductList, useProductListArchive } from "@/src/api/products";
import { useCategory } from "@/src/components/categoryParams";

import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Link href={`/(admin)/menu?category=1&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>COOKIE</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=2&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=3&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=4&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>BENTO CAKES</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#B9D2F7",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: "50%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryCard: {
    width: "40%",
    height: 100,
    backgroundColor: "#FDFDFD",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  categoryText: {
    color: "black",
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
  },
});
