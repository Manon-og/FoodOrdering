import {
  useOverviewProductList,
  useOverviewProductListById,
} from "@/api/products";
import OverViewModal from "@/modals/overviewModals";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface GroupedSalesTransactionItemProps {
  name: string;
  totalQuantity: number;
  numberOfPlaces: number;
  id_products: number;
}

const AdminOverView: React.FC<GroupedSalesTransactionItemProps> = ({
  name,
  totalQuantity,
  numberOfPlaces,
  id_products,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { data: overview } = useOverviewProductListById(id_products.toString());
  console.log("NEW###PRODUCT LISTs:", overview);

  console.log("LINK:", name);
  console.log("LINK:", totalQuantity);

  let totalPlaces = 0;

  if (overview && overview[0].localBatch) {
    const uniquePlaces = new Set(
      overview[0].localBatch.map((item: any) => item.place)
    );
    totalPlaces = uniquePlaces.size + 1;
  }

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{name}</Text>
          <Text style={styles.itemText}>{totalQuantity}</Text>
          <Text style={styles.itemRight}>{totalPlaces} areas</Text>
        </View>
      </TouchableOpacity>
      <OverViewModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        Data={overview}
        totalQuantity={totalQuantity}
        name={name}
        // Pass any additional props required by OverViewModal here
      />
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    paddingBottom: 20,
    borderBottomColor: "#ccc",
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemText: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
  },
  itemLeft: {
    fontSize: 16,
    flex: 1,
    textAlign: "left",
  },
  itemRight: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  transactionContainer: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    marginTop: 5,
  },
});

export default AdminOverView;
