import React from 'react'
import { Text, Image, StyleSheet, Pressable} from 'react-native';
import { View } from '@/src/components/Themed';
import { useLocalSearchParams, Stack, router, Link } from 'expo-router';
import products from '@/assets/data/products';
import { useState } from 'react';
import DefaultPhoto from '@/src/components/ProductListItem'; // nagka error dito
import Button from '@/src/components/Button';
import { UseCart } from '@/src/providers/CartProvider';
import CartProvider from '@/src/providers/CartProvider';
import type { PizzaSize } from '@/src/types';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';


function ProductDetailScreen() {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

  const { id } = useLocalSearchParams();
  const { addItem } = UseCart();
  const route = useRoute();

  const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
  
  const product = products.find((product) => 
  product.id.toString() === id);

  const addToCart = () => { 
    if(!product) {return;}
    addItem(product, selectedSize);
    router.push('/cart');
    }

  if (!product) {
    return (
      <View>
        <Text style = {{ fontSize : 20}}>
          Product not found
        </Text>
      </View>
    )
  }

  return (
    <View style = {styles.container}>
      <Stack.Screen  options = {{title : product.name}} />
      <Stack.Screen 
        options = {{
         title : 'Menu',
         headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),}} />

      <Image  
      source = {{uri : product.image }}
      style = {styles.image}
      />

      
      
      <Text style = {styles.title}>
      {product.name}
      </Text>
    
       {/* <View style = {styles.size }>
          {sizes.map((size) => (
            <Pressable style = {[styles.sizes, {backgroundColor : selectedSize == size? 'gainsboro' : 'white'}]} key={size}
            onPress = {() => setSelectedSize(size)}
            >
            <Text style = {[styles.textSize, {color : selectedSize == size? 'black' : 'gray'}]}> {size}</Text>
            </Pressable>
          ))}
      </View>  */}

      <Text style = {styles.price}>
        ${product.price}
      </Text>

     


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
    color: 'black',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
    
  
  

});

export default ProductDetailScreen;
