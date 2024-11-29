import React, { memo, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  TextInput,
  StyleSheet,
} from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
import {
  useBackInventoryProductList,
  useBatchList,
  useBranchProductList,
  useProductList,
  useSettedBranchProductList,
} from "@/src/api/products";
import { useCategory } from "@/src/components/categoryParams";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchName } from "@/src/components/branchParams";
import { useArchivedParams } from "@/components/archivedParams";

const MemoizedProductListItem = memo(ProductListItem);

export default function MenuScreen() {
  const category = useCategory();
  const { id_branch, branchName } = useBranchName();
  console.log("MERONG POTANGINANG id_branch:", id_branch);
  const { setBranchName, setIdBranch } = useByBranch();
  const { id_archive } = useArchivedParams();
  const IDarchive = id_archive ? 1 : 2;
  console.log("MERONG POTANGINANG IDarchive:", IDarchive);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  const branchId = id_branch || null;
  const currentDate = new Date().toLocaleDateString();
  console.log("currentDate", currentDate);

  // const { data: settedProductsByBranch } = useSettedBranchProductList(
  //   category,
  //   branchId,
  //   currentDate
  // );

  // console.log("MERONG settedProductsByBranch:", settedProductsByBranch);
  const { data: unsettedProductsByBranch } = useBranchProductList(
    category,
    branchId
  );
  console.log("MERONG unsettedProductsByBranch:", unsettedProductsByBranch);

  // useEffect(() => {
  //   settedProductsByBranch;
  // }, [settedProductsByBranch]);

  const productsByBranch = unsettedProductsByBranch;

  console.log("MERONG POTANGINANG:", productsByBranch);

  const { data: productsByBackInventory } =
    useBackInventoryProductList(category);

  console.log("MERONG POTANGINANG********", productsByBackInventory);

  useEffect(() => {
    productsByBackInventory;
  }, [productsByBackInventory]);

  const { data: products, error, isLoading } = useProductList(category);

  useEffect(() => {
    const productList = Array.isArray(products) ? products : [];
    const productByBranchList = Array.isArray(unsettedProductsByBranch)
      ? unsettedProductsByBranch
      : [];
    const useProduct = id_branch ? productByBranchList : productList;
    console.log("MERONG POTANGINANG useProduct:", useProduct);
    const filtered = useProduct.filter(
      (item) =>
        item &&
        item.id_archive === IDarchive &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("MERONG POTANGINANG filtered:", filtered);
    setFilteredProducts(filtered);
  }, [products, unsettedProductsByBranch, id_branch, IDarchive, searchQuery]);

  console.log("MERONG POTANGINANG filteredProducts:", filteredProducts);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <MemoizedProductListItem
        product={item}
        productsByBackInventory={productsByBackInventory}
      />
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        placeholderTextColor="#0E1432"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) =>
          item.id_products
            ? item.id_products.toString()
            : item.id_batch.toString()
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#B9D2F7",
  },
  searchBar: {
    height: 40,
    borderColor: "#0E1432",
    backgroundColor: "#FDFDFD",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    color: "#0E1432",
  },
});
