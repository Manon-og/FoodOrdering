import React, { memo, useEffect, useState } from "react";
import { FlatList, Text, ActivityIndicator, View, TextInput, StyleSheet } from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
import { useBatchList, useBranchProductList, useProductList } from "@/src/api/products";
import { useCategory } from "@/src/components/categoryParams";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchName } from "@/src/components/branchParams";
import { useArchivedParams } from "@/components/archivedParams";
import UserProductListItem from "@/components/UserProductListItem";

const MemoizedProductListItem = memo(UserProductListItem);

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

  const branchId = id_branch || "";
  const { data: productsByBranch } = useBranchProductList(category, branchId);
  const { data: products, error, isLoading } = useProductList(category);

  useEffect(() => {
    const productList = Array.isArray(products) ? products : [];
    const productByBranchList = Array.isArray(productsByBranch) ? productsByBranch : [];
    const useProduct = id_branch ? productByBranchList : productList;
    const filtered = useProduct.filter(
      (item) => item && item.id_archive === IDarchive && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, productsByBranch, id_branch, IDarchive, searchQuery]);

  const renderItem = ({ item }: { item: any }) => {
    console.log("Rendering items:", item);
    return <MemoizedProductListItem product={item} />;
  };

  console.log(
    "PLES?:",
    productsByBranch?.map((item) => item)
  );

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
    backgroundColor: 'white',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});