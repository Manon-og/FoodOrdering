import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import React, { memo, useState, useEffect } from 'react';
import { Link, Stack } from 'expo-router';
import ProductQuantityListItem from '@/src/components/ProductQuantityListItems';
import { useBatchList, useInsertBatch, useProduct, useProductList } from '@/src/api/products';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import QuantityListItem from '@/components/QuantityListItem';
import BatchModal from '@/modals/BatchModals';

const Index = () => {
  const MemoizedProductListItem = memo(ProductQuantityListItem);

  const [selectedCategory, setSelectedCategory] = useState('1'); 
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const [selectedProductId, setSelectedProductId] = useState<string>(''); // State to store selected product ID
  const [selectedBatch, setSelectedBatch] = useState<any[]>([]); // State to store selected batch data
  
  const { data: products, error, isLoading } = useProductList(selectedCategory);
  const { mutate: insertBatch } = useInsertBatch();

  // Fetch batch data based on selectedProductId
  const { data: batch } = useBatchList(selectedProductId);
  
  useEffect(() => {
    if (batch) {
      setSelectedBatch(batch);
    }
  }, [batch]);

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
  
  const filteredProductList = Array.isArray(products) ? products.filter(item => item.id_archive === 2) : [];

  const handleIncrement = (productId: any) => {
    setProductQuantities(prevQuantities => {
      const newQuantities = { ...prevQuantities };
      newQuantities[productId] = (newQuantities[productId] || 1);
      return newQuantities;
    });
  };

  const handleDecrement = (productId: any) => {
    setProductQuantities(prevQuantities => {
      const newQuantities = { ...prevQuantities };
      newQuantities[productId] = Math.max((newQuantities[productId] || 0) - 1, 0);
      if (newQuantities[productId] === 0) {
        delete newQuantities[productId];
      }
      return newQuantities;
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <MemoizedProductListItem 
      product={item} 
      quantity={productQuantities[item.id_products] || 0}
      onIncrement={() => handleIncrement(item.id_products)}
      onDecrement={() => handleDecrement(item.id_products)}
      onOpenModal={() => {
        setSelectedProductId(item.id_products.toString()); // Update selectedProductId
        setModalVisible(true);
      }}
    />
  );

  const handleSubmit = () => {
    Object.entries(productQuantities).forEach(([id_products, quantity]) => {
      insertBatch({ id_products: Number(id_products), quantity });
    });
  };

  const MemoizedQuantityListItemByBatch = memo(QuantityListItem);
  const renderItemByBatch = ({ item }: { item: any }) => {
    return <MemoizedQuantityListItemByBatch batch={item} />;
  };

  return (
    <View style={styles.screenContainer}>
      <Stack.Screen options={{ title: 'Update Quantity' }} />
      <Stack.Screen 
        options = {{
         title : 'Update Quantity',
         headerRight: () => (
            <Pressable onPress={handleSubmit}>
              {({ pressed }) => (
                <FontAwesome
                  name="check"
                  size={25}
                  color='green'
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
        ),}} />
      <View style={styles.categoryContainer}>
        <Pressable style={styles.pressable} onPress={() => setSelectedCategory('1')}>
          <Text style={styles.pressableText}>COOKIE</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => setSelectedCategory('2')}>
          <Text style={styles.pressableText}>BREADS</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => setSelectedCategory('3')}>
          <Text style={styles.pressableText}>CAKES</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => setSelectedCategory('4')}>
          <Text style={styles.pressableText}>BENTO CAKES</Text>
        </Pressable>
      </View>
      <FlatList 
        data={filteredProductList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_products.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <BatchModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        batch={selectedBatch}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    shadowColor: 'lightblue',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 5,
  },
  pressable: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 15,
  },
  pressableText: {
    color: 'lightblue',
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
});