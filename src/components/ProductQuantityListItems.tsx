import { StyleSheet, Image, Pressable } from 'react-native';
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
};

const ProductListItem = ({ product, quantity, onIncrement, onDecrement, onOpenModal }: any) => {
  const handlePress = () => {
    onIncrement();
    onOpenModal();
  };
  return (
    <Pressable onPress={handlePress}   style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{product.name}</Text>
        {quantity > 0 && (
          <View style={styles.numberContainer}>
            <Pressable onPress={onDecrement} style={styles.decrementButton}>
              <Text style={styles.decrementText}>-</Text>
            </Pressable>
            <Text style={styles.number}>{quantity}</Text>
          </View>
        )}
      </View>
    </Pressable>
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
});