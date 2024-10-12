// quantity.tsx
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Alert, Button } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useInsertBatch, useProductList } from '@/src/api/products';
import QuantityModal from '@/src/modals/quantityModals';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [inputQuantity, setInputQuantity] = useState<string>('');

  const { data: products, error, isLoading } = useProductList(selectedCategory);
  const { mutate: insertBatch } = useInsertBatch();

  const handleOpenModal = (productId: string) => {
    setCurrentProductId(productId);
    setInputQuantity(productQuantities[productId]?.toString() || ''); // Set input to the existing quantity
    setIsModalVisible(true);
  };

  const handleConfirmModal = () => {
    const quantity = parseInt(inputQuantity);
    if (quantity > 0) {
      setProductQuantities((prev) => ({
        ...prev,
        [currentProductId as string]: quantity,
      }));
      setIsModalVisible(false);
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid quantity greater than 0.');
    }
  };

  const handleCloseModal = () => {
    if (inputQuantity) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close without saving?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => setIsModalVisible(false) },
        ]
      );
    } else {
      setIsModalVisible(false);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(productQuantities).length === 0) {
      Alert.alert('No Changes', 'No products were updated.');
      return;
    }

    const summary = Object.entries(productQuantities)
      .map(([productId, quantity]) => {
        const product = products?.find((item) => item.id_products === Number(productId));
        return `${product ? product.name : `Unknown Product (ID: ${productId})`}: ${quantity}`;
      })
      .join('\n');

    Alert.alert(
      'Confirm Changes',
      `You are adding:\n\n${summary}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            Object.entries(productQuantities).forEach(([id_products, quantity]) => {
              insertBatch({ id_products: Number(id_products), quantity });
            });
            Alert.alert('Changes Confirmed', 'You have successfully added the products');
          },
        },
      ]
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

  const filteredProductList = Array.isArray(products)
    ? products.filter((item) => item.id_archive === 2)
    : [];

  const renderItem = ({ item }: { item: any }) => (
    <Pressable onPress={() => handleOpenModal(item.id_products)} style={styles.productItem}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.quantityText}>
        Quantity: {productQuantities[item.id_products] || 0}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.screenContainer}>
      <Stack.Screen
        options={{
          title: 'Update Quantity',
          headerRight: () => (
            <Pressable onPress={handleSubmit}>
              {({ pressed }) => (
                <FontAwesome
                  name="check"
                  size={25}
                  color="green"
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

      <QuantityModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        inputQuantity={inputQuantity}
        setInputQuantity={setInputQuantity}
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
  },
  pressable: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 15,
  },
  pressableText: {
    color: 'lightblue',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  productItem: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginTop: 5,
    fontSize: 14,
  },
});