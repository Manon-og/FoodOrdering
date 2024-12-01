import React, { memo, useEffect, useState } from "react";
import {
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { View } from "@/src/components/Themed";
import { useLocalSearchParams, Stack, router, Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useBatchList, usePriceHistory, useProduct } from "@/src/api/products";
import QuantityListItem from "@/src/components/QuantityListItem";
import PriceHistoryModal from "@/src/modals/priceModals"; // Import the modal component

function ProductDetailScreen() {
  const { id: idString } = useLocalSearchParams();
  const id_products = parseFloat(
    typeof idString === "string" ? idString : idString[0]
  );
  console.log("ID BRO WTF", id_products);
  const MemoizedQuantityListItemByBatch = memo(QuantityListItem);

  const { data: batch } = useBatchList(id_products.toString());
  console.log("SHIBAAAAAL", batch);
  const { data: product, error, isLoading } = useProduct(id_products);
  console.log("PRICE PRODUCT", id_products);
  const { data: priceHistory } = usePriceHistory(id_products);
  console.log("PRICE HISTORY", priceHistory);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItemByBatch = ({ item }: { item: any }) => {
    console.log("LL", item);
    return (
      <MemoizedQuantityListItemByBatch
        batch={item}
        style={styles.roundedItem}
      />
    );
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
          title: "Menu",
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
        <TouchableOpacity
          style={styles.priceHistoryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.priceHistoryText}>Price History</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>₱ {product.id_price.amount.toFixed(2)}</Text>
      <Text style={styles.shelf_life}>
        Shelf Life:{" "}
        {product.shelf_life % 1 !== 0
          ? `${
              Math.floor(product.shelf_life) > 0
                ? `${Math.floor(product.shelf_life)} days `
                : ""
            }${Math.round((product.shelf_life % 1) * 24)} hours`
          : `${product.shelf_life} days`}{" "}
      </Text>
      <Text style={styles.description}>{product.description}</Text>

      <FlatList
        data={batch}
        // keyExtractor={(item: any) => item.quantity}
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
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  price: {
    paddingTop: 5,
    fontSize: 20,
    color: "black",
    textAlign: "center",
  },
  shelf_life: {
    paddingTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
  batchItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  batchText: {
    fontSize: 16,
    color: "black",
  },
  topButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  priceHistoryButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  priceHistoryText: {
    fontSize: 14,
    color: "black",
  },
  headerRightButton: {
    padding: 10,
  },
  picker: {
    height: 40,
    width: "100%",
    marginVertical: 10,
  },
  roundedItem: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "white",
  },
});

export default ProductDetailScreen;
