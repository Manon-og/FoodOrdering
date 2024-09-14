import React, { memo } from 'react';
import { FlatList, Text, ActivityIndicator, View } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { useProductList } from '@/src/api/products';
import { useLocalSearchParams } from 'expo-router';
import {useCategory} from '@/src/components/categoryWTF';

const MemoizedProductListItem = memo(ProductListItem);

export default function MenuScreen() {
  const category = useCategory();
  const { data: products, error, isLoading } = useProductList(category);
  console.log('okay',category);

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

const renderItem = ({ item }: { item: any }) => (
  <MemoizedProductListItem product={item} />
);

return (
  <FlatList 
    data={productList}
    renderItem={renderItem}
    keyExtractor={(item) => item.id_products}
    numColumns={2}
    columnWrapperStyle={{ gap: 10 }}
    contentContainerStyle={{ gap: 10, padding: 10 }}
    
  />
);  
}


