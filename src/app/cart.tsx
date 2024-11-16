import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Platform,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { UseCart } from "@/src/providers/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { useBranchName } from "@/components/branchParams";
import { getUserFullName, useUserTransferQuantity } from "@/src/api/products";
import { FontAwesome } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import { useBranchStore } from "@/src/store/branch";

const CartScreen = () => {
  const {
    items,
    total,
    clearCart,
    removeItem,
    addItem,
    totalAmountPerProduct,
  } = UseCart();

  const { mutate: transferQuantity } = useUserTransferQuantity();
  const router = useRouter();
  const { id_branch, branchName } = useBranchStore();

  const roundedTotal = parseFloat(total.toFixed(2));
  const transactionId = uuidv4();

  const [name, setName] = useState<string | null>(null);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const userName = await getUserFullName();
      setName(userName);
    };

    fetchUserName();
  }, []);

  const calculateChange = (amount: string) => {
    const paid = parseFloat(amount);
    if (!isNaN(paid)) {
      setChange(paid - roundedTotal);
    } else {
      setChange(null);
    }
  };

  const handleConfirmPayment = () => {
    if (change !== null && change >= 0) {
      const totalAmounts = Object.values(totalAmountPerProduct);
      items.forEach((item, index) => {
        transferQuantity({
          id_localbranch: item.id_localbranch,
          id_branch: Number(id_branch),
          id_products: item.id_products,
          quantity: item.quantity,
          amount: roundedTotal,
          created_by: name || "",
          id_group: transactionId,
          amount_by_product: totalAmounts[index],
        });
      });

      setTimeout(() => {
        clearCart();
        setPaymentModalVisible(false);
        Alert.alert(
          "Payment Successful",
          `Order completed. Change: ₱${change.toFixed(2)}`
        );
        router.push(
          `/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`
        );
      }, 1000);
    } else {
      Alert.alert("Error", "The amount paid must cover the total cost.");
    }
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from the cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            removeItem(itemId);
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleAddMoreProducts = () => {
    router.push(
      `/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[...items, { id: "add-more", type: "placeholder" }]}
        renderItem={({ item }) => {
          if (item.type === "placeholder") {
            return (
              <Pressable
                style={styles.addMoreContainer}
                onPress={handleAddMoreProducts}
              >
                <FontAwesome name="plus" size={24} color="gray" />
                <Text style={styles.addMoreText}>Add More To Cart</Text>
              </Pressable>
            );
          }
          return (
            <CartListItem
              cartItem={item}
              id_branch={id_branch}
              onRemove={() => handleRemoveItem(item.id)}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{roundedTotal}</Text>
        <Button
          text="Proceed to Payment"
          onPress={() => setPaymentModalVisible(true)}
        />
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

      {/* Payment Modal */}
      <Modal
        visible={isPaymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment</Text>
            <Text style={styles.modalText}>Total: ₱{roundedTotal}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount paid"
              keyboardType="numeric"
              value={amountPaid}
              onChangeText={(value) => {
                setAmountPaid(value);
                calculateChange(value);
              }}
            />
            {change !== null && (
              <Text
                style={[
                  styles.changeText,
                  { color: change >= 0 ? "green" : "red" },
                ]}
              >
                Change: ₱{change >= 0 ? change.toFixed(2) : "Insufficient"}
              </Text>
            )}
            <View style={styles.modalButtonsRow}>
              <Button
                text="Cancel"
                onPress={() => setPaymentModalVisible(false)}
              />
              <Button text="Confirm Payment" onPress={handleConfirmPayment} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContent: {
    paddingBottom: 100,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginVertical: 2,
  },
  addMoreText: {
    marginLeft: 10,
    fontSize: 16,
    color: "gray",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%", // Increase modal width
    padding: 30, // Add more padding for a larger feel
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    width: "100%",
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  changeText: {
    fontSize: 18,
    marginTop: 10,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default CartScreen;
