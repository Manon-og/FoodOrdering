import React, { memo, useEffect } from 'react';
import { FlatList, Text, ActivityIndicator, View } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { useProductList, useProductListArchive } from '@/src/api/products';
import { useCategory } from '@/src/components/categoryParams';

const MemoizedProductListItem = memo(ProductListItem);

export default function ArchiveProductsScreen() {
  const category = useCategory();
  const { data: products, error, isLoading } = useProductListArchive();
  console.log('PRODUCTSARCHUIVw:', products);

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
  const filteredProducts = productList.filter(item => item && item.id_archive === 1);

  const renderItem = ({ item }: { item: any }) => {
    return <MemoizedProductListItem product={item} />;
  };

  return (
    <FlatList 
      data={filteredProducts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id_products.toString()}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );  
}