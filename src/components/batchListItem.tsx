import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAvailableBatch, useBatchList } from '@/src/api/products';

const BatchListItem = ({ id_products }: { id_products: any }) => {
    const { data: batches, isLoading, error } = useBatchList(id_products);
  console.log('Batches>>>:', batches);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.container}>
      <Text style={styles.text}>Batch ID: {item.id_batch}</Text>
      <Text style={styles.text}>Product: {item.id_products.name}</Text>
      <Text style={styles.text}>Quantity: {item.batch}</Text>
    </View>
  );

  return (
    <FlatList
      data={batches}
      keyExtractor={(item) => item.id_batch.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});

export default BatchListItem;