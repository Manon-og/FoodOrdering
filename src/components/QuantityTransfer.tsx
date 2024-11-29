import React, { useState } from "react";
import { View, Alert, Platform, Text, StyleSheet } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Button from "./Button";
import { useRouter } from "expo-router";
import { useGetNotification, useInsertNotification } from "@/api/products";

interface ProductQuantities {
  [id_products: string]: number;
}

interface TransferQuantityParams {
  id_branch: number;
  id_products: number;
  quantity: number;
  date: string;
  currentDate: string;
}

interface ProductionHistoryParams {
  id_products: string;
  quantity: number;
  location: string;
}

interface QuantityTransferProps {
  branchName: string;
  id_branch: number;
  productQuantities: ProductQuantities;
  transferQuantity: (params: TransferQuantityParams) => void;
  insertProductionHistory: (params: ProductionHistoryParams) => void;
}

const QuantityTransfer: React.FC<QuantityTransferProps> = ({
  branchName,
  id_branch,
  productQuantities,
  transferQuantity,
  insertProductionHistory,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const router = useRouter();

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === "set") {
      const currentDate = date || new Date();
      setSelectedDate(currentDate);
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentDate = new Date().toLocaleDateString();
  const { data: notifications } = useGetNotification();
  const notification = useInsertNotification();

  const transferQuantitiesWithDate = () => {
    const hasNotificationForTodayAndBranch = notifications?.some(
      (notif: any) =>
        new Date(notif.created_at).toLocaleDateString() === currentDate &&
        notif.id_branch === id_branch
    );

    console.log("currentDate UP HEREE:", currentDate);
    console.log("NOTIFICATIONS", notifications);
    console.log("ID BRANCH", id_branch);

    if (!hasNotificationForTodayAndBranch) {
      notification.mutate(
        {
          title: `Set Cash Balance Reminder`,
          body: `${branchName} requires a cash balance update.`,
          id_branch: id_branch.toString(),
          type: "Location",
        },
        {
          onSuccess: (data) => {
            console.log("NOTIFICATION", data);
          },
          onError: (error) => {
            console.error("Error NOTIFICATION", error);
          },
        }
      );
    }

    const dateString = formatDateToLocalString(selectedDate);
    Object.entries(productQuantities).forEach(([id_products, quantity]) => {
      transferQuantity({
        currentDate: currentDate,
        id_branch: Number(id_branch),
        id_products: Number(id_products),
        quantity: quantity,
        date: dateString,
      });
    });
    Object.entries(productQuantities).forEach(([id_products, quantity]) => {
      insertProductionHistory({
        location: branchName,
        id_products: id_products.toString(),
        quantity: quantity,
      });
    });
    Alert.alert(
      "Changes Confirmed",
      "You have successfully added the products"
    );
    router.push(
      `/(admin)/locations?id_branch=${id_branch}&branchName=${branchName}`
    );
  };

  const confirmTransfer = () => {
    Alert.alert(
      "Confirm Transfer",
      "Are you sure you want to transfer the quantities?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => transferQuantitiesWithDate(),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display={Platform.OS === "ios" ? "spinner" : "default"}
        onChange={onChange}
      />
      <View style={styles.footer}>
        <Button text="Confirm Transfer" onPress={confirmTransfer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    maxWidth: "75%",
    padding: 15,
    paddingLeft: "30%",
  },
});

export default QuantityTransfer;
