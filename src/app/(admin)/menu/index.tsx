import React, { memo, useEffect } from "react";
import { FlatList, Text, ActivityIndicator, View } from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
import BatchByProductListItem from "@/src/components/ProductListItemByBatch";
import { useBranchProductList, useProductList } from "@/src/api/products";
import { useCategory } from "@/src/components/categoryParams";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchName } from "@/src/components/branchParams";
import { useArchivedParams } from "@/components/archivedParams";

const MemoizedProductListItem = memo(ProductListItem);
// const MemoizedProductListItemByBatch = memo(BatchByProductListItem);

export default function MenuScreen() {
  const category = useCategory();
  console.log("CATEGORY", category);
  const { id_branch, branchName } = useBranchName();
  console.log("id_branchASJDASJDAKSD:", id_branch);
  const { setBranchName, setIdBranch } = useByBranch();

  const { id_archive } = useArchivedParams();
  const IDarchive = id_archive ? 1 : 2;

  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  console.log("FINAL:", branchName);
  console.log("FINALS:", id_branch);

  const branchId = id_branch || "";
  const { data: productsByBranch } = useBranchProductList(category, branchId);
  const { data: products, error, isLoading } = useProductList(category);
  console.log("PRODUCTS:", productsByBranch);

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

  const productList = Array.isArray(products) ? products : [];
  const productByBranchList = Array.isArray(productsByBranch)
    ? productsByBranch
    : [];
  console.log("productByBranchList:", productByBranchList);

  const useProduct = id_branch ? productByBranchList : productList;
  console.log("USEPRODUCT:", useProduct);

  console.log("NEWUSEPRODUCTS:", useProduct);
  const nn = useProduct?.map((item) => item);
  console.log("NN:", nn);

  const filteredProducts = useProduct.filter(
    (item) => item && item.id_archive === IDarchive
  );

  console.log("FILTERED:", filteredProducts);
  console.log(
    "OMG:",
    filteredProducts.map((item) => item.id_products)
  );

  const renderItem = ({ item }: { item: any }) => {
    console.log("Rendering items:", item);
    return <MemoizedProductListItem product={item} />;
  };

  // const renderItemByBatch = ({ item }: { item: any }) => {
  //   console.log("HERE item:", item);
  //   return <MemoizedProductListItemByBatch batch={item} />;
  // };

  console.log(
    "PLES?:",
    productsByBranch?.map((item) => item)
  );

  return (
    <FlatList
      data={filteredProducts}
      renderItem={renderItem}
      keyExtractor={(item) =>
        item.id_products
          ? item.id_products.toString()
          : item.id_batch.toString()
      }
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}
