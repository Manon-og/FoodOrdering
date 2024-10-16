import React, { memo, useEffect, useState } from 'react';
import { Text, Image, StyleSheet, Pressable, ActivityIndicator, FlatList, TouchableOpacity, Button } from 'react-native';
import { View } from '@/src/components/Themed';
import { useLocalSearchParams, Stack, router, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useBatchList, usePriceHistory, useProduct } from '@/src/api/products';
import QuantityListItem from '@/src/components/QuantityListItem';
import PriceHistoryModal from '@/src/modals/priceModals'; // Import the modal component

function ProductDetailScreen() {
  const { id: idString } = useLocalSearchParams();
  const id_products = parseFloat(typeof idString === 'string' ? idString : idString[0]);
  const MemoizedQuantityListItemByBatch = memo(QuantityListItem);

  const { data: batch } = useBatchList(id_products.toString());
  const { data: product, error, isLoading } = useProduct(id_products);
  const { data: priceHistory } = usePriceHistory(id_products);

  const [modalVisible, setModalVisible] = useState(false);

  const renderItemByBatch = ({ item }: { item: any }) => {
    return <MemoizedQuantityListItemByBatch batch={item} />;
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log(error);
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <Stack.Screen
        options={{
          title: 'Menu',
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id_products}`} asChild>
              <Pressable style={styles.headerRightButton}>
                {({ pressed }) => (
                  <FontAwesome
                    name="edit"
                    size={25}
                    color={Colors.light.tint}
                    style={{ opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <View style={styles.topButtonContainer}>
        <TouchableOpacity style={styles.priceHistoryButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.priceHistoryText}>Price History</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₱ {product.id_price.amount}.00</Text>
      <Text style={styles.description}>{product.description}</Text>

      <FlatList
        data={batch}
        keyExtractor={(item) => item.id_batch.toString()}
        renderItem={renderItemByBatch}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />

      <PriceHistoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        priceHistory={priceHistory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
  },
  price: {
    paddingTop: 5,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  batchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  batchText: {
    fontSize: 16,
    color: 'black',
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
  },
  priceHistoryButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
  },
  priceHistoryText: {
    fontSize: 14,
    color: 'black',
  },
  headerRightButton: {
    padding: 10,
  },
});

export default ProductDetailScreen;