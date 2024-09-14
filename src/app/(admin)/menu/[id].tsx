import React, { useEffect } from 'react'
import { Text, Image, StyleSheet, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { View } from '@/src/components/Themed';
import { useLocalSearchParams, Stack, router, Link } from 'expo-router';
// import { useState } from 'react';
// import { DefaultPhoto } from '@/src/components/ProductListItem'; // nagka error dito
// import { UseCart } from '@/src/providers/CartProvider';
// import CartProvider from '@/src/providers/CartProvider';
// import type { PizzaSize } from '@/src/types';
// import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useBatchList, useProduct } from '@/src/api/products';

function ProductDetailScreen() {
  // const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
  const { id: idString } = useLocalSearchParams();
  const id_products = parseFloat(typeof idString === 'string'? idString : idString[0]);

  const { data: batch } = useBatchList(id_products);
  console.log('ITO NA', batch);

  console.log('Batch here', batch?.map(item => item.id_products));
  const aws = batch?.map(item => item.id_products);
  const matchingId = aws?.find(id => id === id_products);

  if (matchingId !== undefined) {
    console.log('Matching ID found:', matchingId);
  } else {
    console.log('No matching ID found');
  }

  const { category: idCategory } = useLocalSearchParams();
  console.log('ID',idCategory);
  const idCategoryString = idCategory ? idCategory.toString() : '';
  console.log('please?>',idCategoryString);

  const { data: product, error, isLoading } = useProduct(id_products);
  console.log(product);
  // const { addItem } = UseCart();
  // const route = useRoute();
  // const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

  const matchingBatches = batch?.filter(item => item.id_products.name === product?.name);
  console.log('Matching batches:', matchingBatches);

  // const addToCart = () => { 
  //   if(!product) {return;}
  //   addItem(product);
  //   router.push('/cart');
  // }

  if(isLoading) {
    return <ActivityIndicator/>
  }

  if(error) {
    console.log(error);
    return  <Text>Error: {error.message}</Text>
  }

  return (
    <View style = {styles.container}>
      <Stack.Screen  options = {{title : product.name}} />
      <Stack.Screen 
        options = {{
         title : 'Menu',
         headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id_products}`} asChild>
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

      <Text style = {styles.title}>
      {product.name}
      </Text>

      <Text style = {styles.price}>
      {product.id_price.amount}
      </Text>
    
      <Text style = {styles.description}>
      {product.description}
      </Text>
    
      <FlatList
        data={matchingBatches}
        keyExtractor={(item) => item.id_batch.toString()}
        renderItem={({ item }) => (
          <View style={styles.batchItem}>
            <Text style={styles.batchText}>Batch ID: {item.id_batch}</Text>
            <Text style={styles.batchText}>Quantity: {item.quantity}</Text>
            <Text style={styles.batchText}>Expiry Date: {item.expire_date}</Text>
          </View>
        )}
      />
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
    paddingTop: 5,
    fontSize: 20,
    color: 'black',
    textAlign: 'center', 
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center', 
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center', 
  },
  batchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  batchText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ProductDetailScreen;