import React, { memo } from 'react';
import { FlatList, Text, ActivityIndicator } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { useProductList } from '@/src/api/products';

// Wrap ProductListItem with React.memo to prevent unnecessary re-renders
const MemoizedProductListItem = memo(ProductListItem);

export default function MenuScreen() {
  const tableName = 'products';
  const { data: products, error, isLoading } = useProductList('products');

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Product</Text>;
  }

  // Define renderItem outside of the return statement to avoid recreating the function
  const renderItem = ({ item }: { item: any }) => <MemoizedProductListItem product={item} />;

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ gap: 10 }}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
}