import { useProductForReturnedProducts } from "@/api/products";
import ReturnedViewModal from "@/modals/expireProductNotifModals";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ItemExpireDetailsReturn = ({
  item,
  expiry,
  id_batch,
  id_branch,
}: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log("HERE EXPIRE", expiry);
  console.log("HERE ID_BATCH", id_batch);
  console.log("HERE ID_BRANCH", id_branch);

  const { data } = useProductForReturnedProducts(id_branch, item.id_products);

  const dateNow = new Date();

  const yearNOW = dateNow.getFullYear();
  const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
  const dayNOW = String(dateNow.getDate()).padStart(2, "0");
  const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;

  console.log("Current Date DISPLAY:", currentDate);
  const expire: any = [];
  const expired: any = [];

  if (data && data.length > 0) {
    data.forEach((item: any) => {
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

  console.log("OUTSIDEE", expire);
  console.log("BEFORE", item.before);
  let warningDisplayed = false;

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>
            {item.name}
            <Text>
              {expire.map((item: any, index: number) => {
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
            </Text>
          </Text>

          <Text style={styles.itemBefore}> {item.before}</Text>
          <Text style={styles.itemAfter}> {item.quantity}</Text>
        </View>
      </TouchableOpacity>
      <ReturnedViewModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        Data={data}
        name={item.id_products.name}
        totalQuantity={item.quantity}
      />
    </>
  );
};

const styles = StyleSheet.create({
  statusCircleContainer: {
    position: "absolute",
    left: 10,
    top: "65%",
  },
  statusCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  redCircle: {
    backgroundColor: "darkred",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    paddingTop: 10,

    borderBottomColor: "#ccc",
    paddingLeft: 15,
  },
  itemText: {
    fontSize: 18,
    maxWidth: "67%",
    color: "#333",
    flex: 1,
  },
  itemBefore: {
    fontSize: 18,
    color: "#333",
  },
  itemAfter: {
    fontSize: 18,
    color: "#333",
    paddingRight: 10,
  },
});

export default ItemExpireDetailsReturn;
