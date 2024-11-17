import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import GroupedVoidSalesTransactionItem from "@/components/AdminGroupedVoidSalesTransactionItem";
import Colors from "@/constants/Colors";
import AdminOverViewDetails from "@/components/AdminOverViewDetails";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  Data: any;
  totalQuantity: number;
  name: string;
  //   totalVoidedSales: number;
  //   currentDate: string;
  //   currentDay: string;
};

const OverViewModal = ({
  modalVisible,
  setModalVisible,
  Data,
  totalQuantity,
  name,
}: //   totalVoidedSales,
//   currentDate,
//   currentDay,
VoidedTransactionModalProps) => {
  console.log("DATA FAUCUJCKCK:", Data);

  const renderPlaceItem = ({ item }: { item: any }) => {
    return (
      <AdminOverViewDetails
        places={[item.place]}
        totalQuantity={item.quantity}
      />
    );
  };

  const renderVoidedItem = ({ item }: { item: any }) => {
    let places = [];

    // const newLocations = item.localBatch.map((item: any) => {
    //   if(item.localBatch.place.some((place: any) => place.place === item.localBatch.place)) {
    //     places.
    //   }

    if (
      item.batch !== undefined &&
      item.batch !== null &&
      item.batch.quantity > 0
    ) {
      places.push({ place: "Back Inventory", quantity: item.batch.quantity });
    }
    if (
      item.confirmedProduct !== undefined &&
      item.confirmedProduct !== null &&
      item.confirmedProduct.quantity > 0
    ) {
      places.push({
        place: "Returned Products",
        quantity: item.confirmedProduct.quantity,
      });
    }
    item.localBatch.map((item: any) => {
      if (places.some((place) => place.place === item.place)) {
        const foundPlace = places.find((place) => place.place === item.place);
        if (foundPlace) {
          foundPlace.quantity += item.quantity;
        }
        item.quantity;
        return;
      } else {
        places.push({
          place: item.place,
          quantity: item.quantity,
        });
      }
    });
    if (
      item.pendingLocalBatch !== undefined &&
      item.pendingLocalBatch !== null &&
      item.pendingLocalBatch.quantity > 0
    ) {
      places.push({
        place: `Pending ${item.pendingLocalBatch.place}`,
        quantity: item.pendingLocalBatch.quantity,
      });
    }

    console.log("place:", item.localBatch);
    console.log("pending:", item.pendingLocalBatch?.place ?? "none");
    console.log("ITEM:", places);

    return (
      <FlatList
        data={places}
        keyExtractor={(placeItem) => placeItem.place}
        renderItem={renderPlaceItem}
      />
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.dayText}>{name}</Text>
          <View style={styles.headerContainer}>
            <Text style={[styles.headerText, styles.statusHeader]}>
              Location
            </Text>
            <Text style={[styles.headerText, styles.statusMiddle]}>
              Total Qty
            </Text>
          </View>
          <FlatList
            data={Data}
            keyExtractor={(item) => item.id_products.toString()}
            renderItem={renderVoidedItem}
          />

          <View style={styles.totalSalesContainer}>
            <Text style={styles.totalSalesText}> Total Quantity:</Text>
            <Text style={styles.totalSalesNumber}>{totalQuantity}</Text>
          </View>

          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(211, 211, 211, .6)",
    marginTop: 50,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dayText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "#0E1432",
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  statusHeader: {
    fontSize: 15,
    textAlign: "left",
    flex: 1,
    paddingLeft: 10,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
    paddingLeft: "40%",
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 100,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  totalSalesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // paddingHorizontal: 20,
    marginBottom: 40,
  },
  totalSalesText: {
    paddingTop: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    paddingRight: 10,
  },
  totalSalesNumber: {
    paddingTop: 40,
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
    paddingRight: 25,
  },
});

export default OverViewModal;
