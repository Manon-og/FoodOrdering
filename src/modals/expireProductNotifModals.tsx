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
import AdminViewBatchToAccept from "@/components/AdminViewBatchToAccept";

type VoidedTransactionModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  Data: any;
  totalQuantity: number;
  name: string;
};

const ReturnedViewModal = ({
  modalVisible,
  setModalVisible,
  Data,
  name,
  totalQuantity,
}: VoidedTransactionModalProps) => {
  const renderByProductsBatch = ({ item }: { item: any }) => {
    console.log("EXPUR?:", item.id_batch.expire_date);

    return (
      <AdminViewBatchToAccept
        expiry={item.id_batch.expire_date}
        places={item.id_products.name}
        totalQuantity={item.quantity}
        totalQty={totalQuantity}
      />
    );
  };
  const dateNow = new Date();

  const yearNOW = dateNow.getFullYear();
  const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
  const dayNOW = String(dateNow.getDate()).padStart(2, "0");
  const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;

  console.log("Current Date DISPLAY:", currentDate);

  // console.log("DATA FOR EXPIRE@@", Data);

  const expire: any = [];
  const expired: any = [];

  if (Data && Data.length > 0) {
    Data.forEach((item: any) => {
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

  console.log("Expire Date!!!!!:", expire);
  let warningDisplayed = false;
  let warningDisplayed2 = false;

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
            <Text style={[styles.headerText, styles.statusHeader]}>Batch</Text>

            <Text style={[styles.headerText, styles.statusMiddle]}>
              Expiry Date
            </Text>

            <Text style={[styles.headerText, styles.moreInfoHeader]}>Qty</Text>
          </View>

          <FlatList
            data={Data}
            keyExtractor={(item) => item.id_localbranch.toString()}
            renderItem={renderByProductsBatch}
          />

          {expire.map((item: any, index: number) => {
            if (item === currentDate && !warningDisplayed) {
              warningDisplayed = true;
              return (
                <View key={index}>
                  <Text style={styles.footerWarning}>
                    Warning!
                    <Text style={styles.footerWarning2}>
                      {" "}
                      Expires 24 hours after midnight.
                    </Text>
                  </Text>
                </View>
              );
            }
            return null;
          })}
          {expired.map((item: any, index: number) => {
            if (item === currentDate && !warningDisplayed2) {
              warningDisplayed2 = true;
              return (
                <View key={index}>
                  <Text
                    style={
                      warningDisplayed === false
                        ? styles.footerWarning3
                        : styles.footerWarning5
                    }
                  >
                    Warning!
                    <Text
                      style={
                        warningDisplayed === false
                          ? styles.footerWarning4
                          : styles.footerWarning6
                      }
                    >
                      {" "}
                      Dispose of by midnight.
                    </Text>
                  </Text>
                </View>
              );
            }
            return null;
          })}

          <View style={styles.footer}>
            <Text style={styles.footerTextLeft}>Overall Quantity:</Text>
            <Text style={styles.footerTextRight}>{totalQuantity}</Text>
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
  footer: {
    // marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 20,
  },
  footerWarning: {
    fontSize: 15,
    paddingTop: 20,
    color: "darkred",
    fontWeight: "bold",
  },
  footerWarning2: {
    fontSize: 15,
    paddingTop: 20,
    color: "darkred",
    fontWeight: "normal",
  },
  footerWarning3: {
    fontSize: 18,
    paddingTop: 20,
    color: "#C8A032",
    fontWeight: "bold",
  },
  footerWarning4: {
    fontSize: 18,
    paddingTop: 20,
    color: "#C8A032",
    fontWeight: "normal",
  },
  footerWarning5: {
    fontSize: 18,
    color: "#C8A032",
    fontWeight: "bold",
  },
  footerWarning6: {
    fontSize: 18,
    color: "#C8A032",
    fontWeight: "normal",
  },
  footerTextLeft: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    paddingLeft: 10,
  },
  footerTextRight: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 15,
  },
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
    paddingLeft: "12%",
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
    paddingLeft: "23%",
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
    paddingRight: 12,
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

export default ReturnedViewModal;
