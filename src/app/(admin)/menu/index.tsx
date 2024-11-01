import React, { memo, useEffect, useState } from "react";
import { FlatList, Text, ActivityIndicator, View, Alert } from "react-native";
import ProductListItem from "@/src/components/ProductListItem";
import BatchByProductListItem from "@/src/components/ProductListItemByBatch";
import {
  useBackInventoryProductList,
  useBatchList,
  useBranchProductList,
  useProductList,
} from "@/src/api/products";
import { useCategory } from "@/src/components/categoryParams";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchName } from "@/src/components/branchParams";
import { useArchivedParams } from "@/components/archivedParams";
// import useBatchData from "@/components/totalQuantity";

const MemoizedProductListItem = memo(ProductListItem);
// const MemoizedProductListItemByBatch = memo(BatchByProductListItem);

export default function MenuScreen() {
  // const [totalQuantities, setTotalQuantities] = useState<TotalQuantities>({});
  // const [batchData, setBatchData] = useState({});
  // type TotalQuantities = {
  //   [key: string]: number;
  // };

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
  const { data: productsByBackInventory } =
    useBackInventoryProductList(category);

  const { data: products, error, isLoading } = useProductList(category);
  console.log(
    "@@@@@@@@#@#@#",
    products?.map((id_products) => id_products.id_products)
  );

  console.log("IT WORKKKKKKSSSSS:", productsByBranch);
  console.log("IT%%%%%%?:", productsByBackInventory);

  const productIds =
    products?.map((id_products) => id_products.id_products) ?? [];
  console.log("Product IDs:", productIds);

  // let id = "";
  // for (let i = 0; i < productIds.length; i++) {
  //   console.log("Product ID:", productIds[i]);
  //   id = productIds[i];
  // }r

  // useEffect(() => {
  //   const fetchBatchData = async () => {
  //     const allTotalQuantities: { [key: string]: number } = {};

  //     for (let i = 0; i < productIds.length; i++) {
  //       const id = productIds[i];
  //       const { data: m } = await useBatchList(id);

  //       if (m && Array.isArray(m)) {
  //         // Ensure m is an array
  //         const totalQuantity = m.reduce(
  //           (acc, item) => acc + (item.quantity || 0),
  //           0
  //         );
  //         allTotalQuantities[id] = totalQuantity;
  //       } else {
  //         console.error("Unexpected data format:", m);
  //       }
  //     }

  //     setTotalQuantities(allTotalQuantities);
  //   };

  //   fetchBatchData();
  // }, [productIds]);

  // DI KAYA SA LOGIC KO YAWA GANINA RAKO ANI, PISTENG YAWA.

  // const { data: m } = useBatchList("180");

  // console.log("HIRRR", m);
  // const totalQuantity = m?.reduce((acc, item) => acc + (item.quantity || 0), 0);
  // console.log("fck", totalQuantity);

  // const ll = ({ item }: { item: any }) => {
  //   console.log("Rendering items:", item);
  //   return <MemoizedProductListItem product={item} />;
  // };

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

  const productByBackInventoryList = Array.isArray(productsByBackInventory)
    ? productsByBackInventory
    : [];

  const nn = productList && productByBackInventoryList;

  console.log("NN:", nn);

  console.log("DITO PO:", productByBackInventoryList);

  console.log("productByBranchList:", productByBranchList);

  const useProduct = id_branch ? productByBranchList : productList;
  console.log("USEPRODUCT:", useProduct);

  console.log("NEWUSEPRODUCTS:", useProduct);
  // const nn = useProduct?.map((item) => item.id_products);
  // console.log("NN%%%:", nn);

  // const ID = nn.map((id) => useBatchList(id));
  // console.log("WP", ID);

  // // Function to fetch quantities per product id
  // const fetchQuantitiesForProducts = async (productIds: any[]) => {
  //   // If productIds exist, iterate and fetch quantities for each id
  //   const quantityResults = await Promise.all(
  //     productIds.map((id) => useBatchList(id))
  //   );
  //   console.log("LLL", quantityResults);

  //   // Merge all results
  //   const mergedQuantities = quantityResults.reduce(
  //     (acc: { [key: string]: number }, { data: quantity }) => {
  //       // Summing up quantities per id_products
  //       quantity?.forEach((item) => {
  //         const productId = item.id_products?.id_products || item.id_products;
  //         const itemQuantity = item.quantity || 0;

  //         if (productId) {
  //           acc[productId] = (acc[productId] || 0) + itemQuantity;
  //         }
  //       });

  //       return acc;
  //     },
  //     {}
  //   );

  //   console.log("Quantities Per Product:", mergedQuantities);
  // };

  // // Call the function with your product ids
  // if (nn && nn.length > 0) {
  //   fetchQuantitiesForProducts(nn);
  // }

  const filteredProducts = useProduct.filter(
    (item) => item && item.id_archive === IDarchive
  );

  const filteredProduct = useProduct.filter((item) => item.quantity < 10);
  console.log("ALERTTTT:", filteredProduct);

  console.log("FILTERED:", filteredProducts);
  console.log(
    "OMG:",
    filteredProducts.map((item) => item.id_products)
  );

  // const { data: m } = useBatchList("180");
  const renderItem = ({ item }: { item: any }) => {
    const id = item.id_products;
    const quantity = item.quantity;
    console.log("ID$:", id);
    console.log("QUANTITY$:", quantity);

    // const totalQuantity = totalQuantities[id];
    // console.log("TOTAL QUANTITY", totalQuantity);
    console.log("Rendering items:", item);
    return (
      <MemoizedProductListItem
        product={item}
        productsByBackInventory={productsByBackInventory}
      />
    );
  };

  console.log(
    "PLES?:",
    productsByBranch?.map((item) => item)
  );

  // console.log(
  //   "??????????:",
  //   productsByBackInventory?.map((item) => item.quantity)
  // );

  return (
    <FlatList
      data={filteredProducts}
      renderItem={renderItem}
      keyExtractor={(item) =>
        item.id_products.toString()
          ? item.id_products.toString()
          : item.id_batch.toString()
      }
    />
  );
}
