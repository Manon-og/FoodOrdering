import { StyleSheet, Image, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View,} from '@/src/components/Themed';
import { Product } from '@/src/types';
import { Link, useSegments } from 'expo-router';

type ProductListItemProps = { 
  product: { 
    id: string;
    name: string;
    image: string;
    price: { 
      amount: number;
    };
  };
  amount: number;
 };

export const DefaultPhoto = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const QuantityListItem = ({batch} : any) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/menu/${batch.id_products}: any`} asChild>
        <View>
        <View style={styles.contentContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.title}>Batch ID: {batch.id_batch}</Text>
            <Text style={styles.price}>Quantity: {batch.quantity}</Text>
            <Text style={styles.red}>Expiry Date: {batch.expire_date}</Text>
            <Text style={styles.price}>Location: {batch.id_branch?.place || 'Back Inventory'}</Text>
          </View>
        </View>
        </View>
      {/* <Image style={styles.image} 
      source={{uri: product.image || DefaultPhoto }} 
      resizeMode = 'contain'
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Total Stocks: {product.quantity}</Text>  */}
    </Link>
  );
}

export default QuantityListItem;

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
