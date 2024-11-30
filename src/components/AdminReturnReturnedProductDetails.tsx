import {
  useGetPendingProductsDetailsById,
  useProductByIdForReturnedProducts,
  useProductForReturnedProducts,
} from "@/api/products";
import ReturnedViewProductModal from "@/modals/returnedProductModals";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";

interface GroupedSalesTransactionItemProps {
  name: string;
  quantity: number;
  expire_date: string;
  data: any;
  id_branch: number;
  data_id: any;
  id_products: number;
}

const GroupedReturnedItemDetails: React.FC<
  GroupedSalesTransactionItemProps
> = ({
  name,
  quantity,
  expire_date,
  data,
  id_branch,
  data_id,
  id_products,
}) => {
  console.log("id_branch:", id_branch);
  console.log("id_products:", id_products);

  const { data: dataById } = useGetPendingProductsDetailsById(
    id_branch.toString(),
    id_products
  );
  console.log("DATA BY ID***):", dataById);

  const exp = dataById?.map((item: any) => item.id_batch.expire_date);
  console.log("EXP:", exp);

  // const id_branch = data.map((item: any) => item.id_branch.id_branch);
  // const id_products = data.map((item: any) => item.id_products.id_products);
  // console.log("ID_BRANCH:", id_branch);
  // console.log("ID_PRODUCTS:", id_products);

  // const { data: dataById } = useProductByIdForReturnedProducts(
  //   id_branch,
  //   id_products
  // );

  // console.log("DATA BY ID))):", dataById);

  const dateNow = new Date();
  const [modalVisible, setModalVisible] = useState(false);

  const yearNOW = dateNow.getFullYear();
  const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
  const dayNOW = String(dateNow.getDate()).padStart(2, "0");
  const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;

  console.log("Current Date DISPLAY:", currentDate);
  const expire: any = [];
  const expired: any = [];

  if (dataById && dataById.length > 0) {
    dataById.forEach((item: any) => {
      console.log("Expire Date!!!!!:", item.id_batch.expire_date);
      const date = new Date(item.id_batch.expire_date);
      date.setDate(date.getDate() - 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const newDateString = `${year}-${month}-${day}`;
      expire.push(newDateString);
      expired.push(item.id_batch.expire_date);
    });
  } else {
    console.log("No data available");
  }

  console.log("OUTSIDEE-+", expire);
  console.log("OUTSIDEE-+", expired);

  let warningDisplayed = false;

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemLeftContainer}>
            <Text style={styles.itemLeft}>{name}</Text>
            {expire.map((item: any, index: number) => {
              if (item === currentDate && !warningDisplayed) {
                warningDisplayed = true;
                return (
                  <View key={index} style={styles.warning}>
                    <Text>❗️</Text>
                  </View>
                );
              }
              return null;
            })}
            {expired.map((item: any, index: number) => {
              if (item === currentDate && !warningDisplayed) {
                warningDisplayed = true;
                return (
                  <View key={index}>
                    <Text>❗️</Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
          <Text style={styles.itemRight}>{quantity}</Text>
        </View>
      </TouchableOpacity>
      <ReturnedViewProductModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        Data={dataById}
        exp={exp}
        name={name}
        totalQuantity={quantity}
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
    borderBottomColor: "#ccc",
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemLeftContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  warning: {
    marginLeft: 5,
  },
  itemLeft: {
    fontSize: 18,
    textAlign: "left",
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "black",
    paddingLeft: 25,
  },
  itemRight: {
    // borderRadius: 10,
    // borderWidth: 1,
    // borderColor: "black",
    fontSize: 18,
    textAlign: "center",
    paddingRight: "15%",
  },
});

export default GroupedReturnedItemDetails;
