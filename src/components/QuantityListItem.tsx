import { StyleSheet, Image, Pressable, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { useState } from "react";
import AdjustBackInventoryQuantity from "@/modals/adjustBackInventoryQuantity";

const QuantityListItem = ({ batch }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  console.log("BATCH??????!", batch);

  let place = "";
  if (batch.label === "returned products") {
    place = "Returned Products";
  } else if (batch.type === "pending") {
    place = `Pending`;
  } else if (batch.branch) {
    place = batch.branch.place;
  } else {
    place = "Back Inventory";
  }

  const formatExpireDate = (dateString: any) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-CA");
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const expireDate =
    batch.type === "pending"
      ? batch.batch.expire_date
      : batch.branch
      ? batch.batch.expire_date
      : batch.expire_date;

  const formattedExpireDate = formatExpireDate(expireDate);

  // ${batch.branch.place}
  return (
    <View>
      <View style={styles.contentContainer}>
        <View style={styles.itemContainer}>
          {batch.branch && place === batch.branch.place ? (
            <>
              <Text style={styles.title}>Quantity: {batch.quantity}</Text>
              <View style={styles.row}>
                <Text style={styles.quantity}>{place}</Text>
                <Text style={styles.view}>{batch.branch ? "" : "edit"}</Text>
              </View>
              {/* {batch.type === "pending" && (
                <Text style={styles.date}>Until: {batch.date}</Text>
              )} */}
              <Text style={styles.red}>Expiry Date: {formattedExpireDate}</Text>
            </>
          ) : (
            <View>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.title}>Quantity: {batch.quantity}</Text>
                <View style={styles.row}>
                  <Text style={styles.quantity}>
                    {batch.type === "pending"
                      ? `Pending ${batch.branch.place}`
                      : place}
                  </Text>
                  <Text style={styles.view}>edit</Text>
                </View>
                {/* {batch.type === "pending" && (
                  <Text style={styles.date}>Until: {batch.date}</Text>
                )} */}
                <Text style={styles.red}>
                  Expiry Date: {formattedExpireDate}
                </Text>
              </TouchableOpacity>
              <AdjustBackInventoryQuantity
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                Data={batch.quantity}
                Location={place}
                MainData={batch}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default QuantityListItem;

const styles = StyleSheet.create({
  view: {
    textAlign: "right",
    flex: 1,
    paddingRight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  date: {
    fontSize: 10,
    color: "#666",
    fontWeight: "bold",
  },
});