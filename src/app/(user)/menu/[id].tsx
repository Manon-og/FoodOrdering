import React from 'react';
import { Text, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { View } from '@/src/components/Themed';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useState } from 'react';
import { DefaultPhoto } from '@/src/components/ProductListItem'; // Ensure the correct import path
import Button from '@/src/components/Button';
import { UseCart } from '@/src/providers/CartProvider';
import CartProvider from '@/src/providers/CartProvider'; 
import { useRoute } from '@react-navigation/native';
import { useProduct } from '@/src/api/products';
import { ScrollView } from 'react-native';

function ProductDetailScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);

  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = UseCart();

  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem(product);
    router.push('/cart');
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch Product</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: product.image || DefaultPhoto }} style={styles.image} />
        <Text style={styles.price}>₱ {product.id_price.amount}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Button text="Add to Cart" onPress={addToCart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 100, // Ensure there's space for the footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    paddingBottom: '10%',
    fontStyle: 'italic',
  },
});

export default ProductDetailScreen;