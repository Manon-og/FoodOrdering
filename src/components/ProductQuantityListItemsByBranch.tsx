import { StyleSheet, Image, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View } from '@/src/components/Themed';
import React, { useState } from 'react';
import AvailableBatch from '@/src/components/AvailableBatch';
import BranchSelectionModal from '@/src/modals/branchSelectionModals';

type ProductListItemProps = { 
  product: { 
    id_products: string;
    name: string;
    image: string;
    price: { 
      amount: number;
    };
  };
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onBranchChange: (id_products: string, id_branch: string | null) => void;
};

const ProductListItem = ({ product, quantity, onIncrement, onDecrement, onBranchChange }: ProductListItemProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectBranch = (id_branch: string | null) => {
    onBranchChange(product.id_products, id_branch);
  };

  return (
    <Pressable onPress={() => setModalVisible(true)} style={styles.container}>
      <View style={styles.row}>
        <View style={styles.productInfo}>
          <Text style={styles.title}>{product.name}</Text>
          <AvailableBatch productId={product.id_products} />
        </View>
        {quantity > 0 && (
          <View style={styles.numberContainer}>
            <Pressable onPress={onDecrement} style={styles.decrementButton}>
              <Text style={styles.decrementText}>-</Text>
            </Pressable>
            <Text style={styles.number}>{quantity}</Text>
          </View>
        )}
      </View>
      <BranchSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        id_products={product.id_products}  // Ensure id_products is passed here
        // onSelectBranch={handleSelectBranch}
      />
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
  productInfo: {
    flexDirection: 'row',
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