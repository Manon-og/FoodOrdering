import { StyleSheet, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { Product } from "@/src/types";
import { Link, useSegments } from "expo-router";

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

export const DefaultPhoto =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";

const QuantityListItem = ({ batch }: any) => {
  const segments = useSegments();

  return (
    <View>
      <View style={styles.contentContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>Quantity: {batch.quantity}</Text>
          <Text style={styles.quantity}>
            {batch.branch ? batch.branch.place : "Back Inventory"}
          </Text>
          <Text style={styles.price}>
            {batch.branch ? `Local Batch ID: ` : `Batch ID: `}
            {batch.branch ? batch.localbatch : batch.id_batch}
          </Text>
          <Text style={styles.red}>
            Expiry Date:{" "}
            {batch.branch ? batch.batch.expire_date : batch.expire_date}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default QuantityListItem;

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: "90%",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  price: {
    fontSize: 10,
    color: "#666",
    fontWeight: "bold",
  },
  red: {
    fontSize: 10,
    color: "maroon",
    fontWeight: "bold",
  },
});
