import { StyleSheet, Image, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View,} from '@/src/components/Themed';
import { Product } from '@/src/types';
import { Link, useSegments } from 'expo-router';

type ProductListItemProps = { 
  product: Product;
 };

export const DefaultPhoto = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const ProductListItem = ({product} : ProductListItemProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
    <Pressable style={styles.container}>
      <Image style={styles.image} 
      source={{uri: product.image || DefaultPhoto }} 
      resizeMode = 'contain'
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₱{product.price}</Text> 
      
    </Pressable>
    </Link>
  );
}

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
   backgroundColor: 'white',
   padding: 10,
   borderRadius: 20,
   flex: 1,
   maxWidth: '50%',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  price: {
    fontSize: 10,
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
