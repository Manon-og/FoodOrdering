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
import { color } from "react-native-elements/dist/helpers";

const MemoizedProductListItem = memo(ProductListItem);

export default function MenuScreen() {
  const category = useCategory();
  const { id_branch, branchName } = useBranchName();
  const { setBranchName, setIdBranch } = useByBranch();
  const { id_archive } = useArchivedParams();
  const IDarchive = id_archive ? 1 : 2;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  const branchId = id_branch || null;
  const currentDate = new Date().toLocaleDateString();

  const { data: settedProductsByBranch } = useSettedBranchProductList(
    category,
    branchId,
    currentDate
  );

  const { data: unsettedProductsByBranch } = useBranchProductList(
    category,
    branchId
  );

  const productsByBranch = id_branch
    ? settedProductsByBranch
    : unsettedProductsByBranch;

  const { data: productsByBackInventory } =
    useBackInventoryProductList(category);

  const { data: products, error, isLoading } = useProductList(category);

  useEffect(() => {
    const productList = Array.isArray(products) ? products : [];
    const productByBranchList = Array.isArray(productsByBranch)
      ? productsByBranch
      : [];
    const useProduct = id_branch ? productByBranchList : productList;
    const filtered = useProduct.filter(
      (item) =>
        item &&
        item.id_archive === IDarchive &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, productsByBranch, id_branch, IDarchive, searchQuery]);

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
