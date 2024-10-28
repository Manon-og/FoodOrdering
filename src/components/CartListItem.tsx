import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { UseCart } from '../providers/CartProvider';
import Colors from '../constants/Colors';
import { DefaultPhoto } from './ProductListItem';
import CartModal from '../modals/cartModals';

type CartListItemProps = {
  cartItem: any;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const { updateQuantity } = UseCart();
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);

  const handleIncrement = () => {
    updateQuantity(cartItem.id, 1);
  };

  const handleDecrement = () => {
    if (cartItem.quantity - 1 <= 0) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from the cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes', onPress: () => updateQuantity(cartItem.id, -1) },
        ]
      );
    } else {
      updateQuantity(cartItem.id, -1);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: cartItem.product.image || DefaultPhoto }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{cartItem.product.name}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>₱{cartItem.product.id_price.amount.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <FontAwesome onPress={handleDecrement} name="minus" color="gray" style={{ padding: 5 }} />

        <Pressable onPress={() => setQuantityModalVisible(true)}>
          <Text style={styles.quantity}>{cartItem.quantity}</Text>
        </Pressable>

        <FontAwesome onPress={handleIncrement} name="plus" color="gray" style={{ padding: 5 }} />
      </View>

      <CartModal
        visible={quantityModalVisible}
        onClose={() => setQuantityModalVisible(false)}
        onConfirm={(newQuantity) => updateQuantity(cartItem.id, newQuantity - cartItem.quantity)}
        currentQuantity={cartItem.quantity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: 'center',
    marginRight: 10,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  quantitySelector: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  quantity: {
    fontWeight: '500',
    fontSize: 18,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
});

export default CartListItem;
