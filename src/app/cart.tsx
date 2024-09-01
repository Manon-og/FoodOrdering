import React from 'react';
import { View, Text, Platform, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { UseCart } from '@/src/providers/CartProvider';
import CartListItem from '../components/CartListItem';
import Button from '../components/Button';



 const CartScreen = () => {
    const { items, total } = UseCart();
    const roundedTotal = parseFloat(total.toFixed(2));

  return (
    <View style={{padding: 10}}>
      
      <FlatList 
       data={items}
       renderItem={({item}) => (
      <CartListItem cartItem = {item}/>)}
       contentContainerStyle = {{ gap: 10}}
       />
       <Text style={{marginTop: 20, fontSize:20, fontWeight: '500'}}>Total: ₱{roundedTotal}</Text>
      <Button text= 'Checkout'/>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
};

export default CartScreen;