import React from 'react'
import { Text, Image, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import { View } from '@/src/components/Themed';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useState } from 'react';
import { DefaultPhoto } from '@/src/components/ProductListItem'; // nagka error dito
import Button from '@/src/components/Button';
import { UseCart } from '@/src/providers/CartProvider';
import CartProvider from '@/src/providers/CartProvider'; // nagka error dito
import type { PizzaSize } from '@/src/types';
import { useRoute } from '@react-navigation/native';
import { useProduct } from '@/src/api/products';

function ProductDetailScreen() {

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string'? idString : idString[0]);

  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = UseCart();




  const addToCart = () => { 
    if(!product) {return;}
    addItem(product);
    router.push('/cart');
    }

  if(isLoading) {
    return <ActivityIndicator/>
  }

  if(error) {
    return <Text>Failed to fetch Product</Text>
  }

  return (
    <View style = {styles.container}>
      <Stack.Screen  options = {{title : product.name}} />
      <Image  
      source = {{uri : product.image || DefaultPhoto}}
      style = {styles.image}
      />

      <Text style = {styles.price}>
            ₱ {product.id_price.amount}
            </Text>

      <Text style = {styles.description}>
         {product.description}
      </Text>

      <Button text = "Add to Cart" 
      onPress = {addToCart} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
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
  size: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  sizes: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSize: {
    fontSize: 20,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    paddingBottom: '50%',
    fontStyle: 'italic',
  },
  

});

export default ProductDetailScreen;
