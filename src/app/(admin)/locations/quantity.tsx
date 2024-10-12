import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import React, { memo, useState } from 'react';
import { Stack } from 'expo-router';
import ProductQuantityListItemByBranch from '@/src/components/ProductQuantityListItemsByBranch';
import { useProductList, useBatchListByCategory, useInsertBatch } from '@/src/api/products';
import { FontAwesome } from '@expo/vector-icons';
import BatchListModal from '@/src/modals/branchSelectionModals';

const Index = () => {
  const MemoizedProductListItem = memo(ProductQuantityListItemByBranch);

  const [selectedCategory, setSelectedCategory] = useState('1'); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { data: products, error, isLoading } = useProductList(selectedCategory);
  const { data: productQuantity } = useBatchListByCategory(selectedCategory);
  const { mutate: insertBatch } = useInsertBatch();

  console.log('Product Quantity:', productQuantity);
  console.log('Products:', products);
  console.log('Selected Category:', selectedCategory);
  console.log('Selected Product ID:', selectedProductId);

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
  const num = filteredProductList.map(item => item.id_products);

  const handleOpenModal = (productId: number) => {
    setSelectedProductId(productId);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => handleOpenModal(item.id_products)}>
      <MemoizedProductListItem 
        product={item}
        quantity={productQuantity?.[item.id_products] ?? 0}
        onIncrement={() => {}}
        onDecrement={() => {}}
        onBranchChange={() => {}}
      />
    </Pressable>
  );

  const handleSubmit = () => {
    // Handle submit logic here if needed
  };

  return (
    <View style={styles.screenContainer}>
      <Stack.Screen options={{ title: 'Update Quantity' }} />
      <Stack.Screen 
        options={{
          title: 'Update Quantity',
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
          ),
        }} 
      />
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
      {selectedProductId && (
        <BatchListModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          id_products={num}
        />
      )}


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