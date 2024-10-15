import { StyleSheet, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View } from '@/src/components/Themed';
import { Checkbox } from 'react-native-paper'; // Assuming you are using react-native-paper for the checkbox

const QuantityBatchListItem = ({ batch, isChecked, onToggleCheckbox }: any) => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>Batch ID: {batch.id_batch}</Text>
        <Text style={styles.price}>Quantity: {batch.quantity}</Text>
        <Text style={styles.red}>Expiry Date: {batch.expire_date}</Text>
        <Text style={styles.price}>Location: {batch.id_branch?.place || 'Back Inventory'}</Text>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => onToggleCheckbox(batch.id_batch)}
        />
      </View>
    </View>
  );
};

export default QuantityBatchListItem;

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: '90%',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  price: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  red: {
    fontSize: 10,
    color: 'maroon',
    fontWeight: 'bold',
  },
});