import { StyleSheet, Text, View, Image  } from 'react-native';
import Colors from '@/constants/Colors';
import products  from '../../../assets/data/products';
import EditScreenInfo from '@/components/EditScreenInfo'; 

const product = products[0];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Image source={{uri:product.image}} style={styles.image}/>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₱{product.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    aspectRatio: 1/1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  }
});
