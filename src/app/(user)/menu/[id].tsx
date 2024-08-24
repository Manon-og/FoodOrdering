import React from 'react'
import { Text, Image, StyleSheet, Pressable, ActivityIndicator} from 'react-native';
import { View } from '@/src/components/Themed';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useState } from 'react';
import { DefaultPhoto } from '@/src/components/ProductListItem'; // nagka error dito
import Button from '@/src/components/Button';
import { UseCart } from '@/src/providers/CartProvider';
import CartProvider from '@/src/providers/CartProvider';
import type { PizzaSize } from '@/src/types';
import { useRoute } from '@react-navigation/native';
import { useProduct } from '@/src/api/products';


function ProductDetailScreen() {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string'? idString : idString[0]);
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = UseCart();
  const route = useRoute();

  const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

  const addToCart = () => { 
    if(!product) {return;}
    addItem(product, selectedSize);
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

      <Text>
        Select Size
      </Text>
    
       <View style = {styles.size }>
          {sizes.map((size) => (
            <Pressable style = {[styles.sizes, {backgroundColor : selectedSize == size? 'gainsboro' : 'white'}]} key={size}
            onPress = {() => setSelectedSize(size)}
            >
            <Text style = {[styles.textSize, {color : selectedSize == size? 'black' : 'gray'}]}> {size}</Text>
            </Pressable>
          ))}
      </View> 

      <Text style = {styles.price}>
        ${product.price}
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
    marginTop: 'auto',
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
  

});

export default ProductDetailScreen;
