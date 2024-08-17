import products from '@/assets/data/products';
import { FlatList } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';

export default function MenuScreen() {
  return (
    <FlatList
    data = {products}
    renderItem = {({item}) => <ProductListItem product = {item} />}
    numColumns={2}
    columnWrapperStyle={{gap: 10}}
    contentContainerStyle={{gap: 10, padding: 10}}

    />
  );
}

