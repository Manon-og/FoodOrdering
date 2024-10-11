import { StyleSheet, Image, Pressable } from 'react-native';
import Colors from '../constants/Colors';
import { Text, View } from '@/src/components/Themed';
import { Link, useSegments } from 'expo-router';

type Batch = {
  id_product: any;
  id_batch: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    image: string;
    price: {
      amount: number;
    };
  };
};

type BatchByProductListItemProps = {
  batch: Batch;
};

export const DefaultPhoto = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const BatchByProductListItem = ({ batch }: any) => {
  const segments = useSegments();

  if (!batch) {
    console.error('Batch is undefined');
    return null;
  }

  return (
    <Link href={`/${segments[0]}/menu/${batch.id_batch.id_products}:any`} asChild>
      <Pressable style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: batch.id_products.image??  DefaultPhoto }}
          resizeMode='contain'
        />
        <Text style={styles.title}>{batch.id_products.name ?? 'Unknown Product'}</Text>
        <Text style={styles.price}>Batch Quantity: {batch.quantity}</Text>
      </Pressable>
    </Link>
  );
};

export default BatchByProductListItem;

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
    width: '100%',
    aspectRatio: 1,
  },
});