import { StyleSheet, Image, Pressable, TextInput } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View } from '@/src/components/Themed';
import React from 'react';

type ProductListItemProps = { 
  product: { 
    id: string;
    name: string;
    image: string;
    price: { 
      amount: number;
    };
  };
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onQuantityChange: (quantity: number) => void;
};

const ProductListItem = ({ product, quantity, onIncrement, onDecrement, onQuantityChange }: ProductListItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{product.name}</Text>
        <View style={styles.numberContainer}>
          <Pressable onPress={onDecrement} style={styles.decrementButton}>
            <Text style={styles.decrementText}>-</Text>
          </Pressable>
          <TextInput
            style={styles.number}
            value={quantity.toString()}
            keyboardType="numeric"
            onChangeText={(value) => onQuantityChange(Number(value))}
          />
          <Pressable onPress={onIncrement} style={styles.incrementButton}>
            <Text style={styles.incrementText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    color: Colors.light.tint,
    padding: '5%',
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  number: {
    fontSize: 17,
    color: Colors.light.tint,
    padding: '5%',
    textAlign: 'center',
  },
  decrementButton: {
    marginRight: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  decrementText: {
    fontSize: 35,
    color: 'darkred',
    width: 20,  
    textAlign: 'center',
  },
  incrementButton: {
    marginLeft: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  incrementText: {
    fontSize: 35,
    color: 'green',
    width: 20,  
    textAlign: 'center',
  },
});
