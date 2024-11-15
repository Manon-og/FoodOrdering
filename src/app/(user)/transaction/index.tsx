import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import {
  use,
  useGroupedSalesTransaction,
  useSalesTransactionById,
  useUserVoid,
} from "@/src/api/products";

import GroupedSalesTransactionId from "@/components/GroupSalesTransactionId";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";

const Index = () => {
  const { id_group, id_void } = useLocalSearchParams();
  const voidTransaction = useUserVoid();
  const router = useRouter();

  const handleVoidTransaction = () => {
    if (id_group) {
      voidTransaction.mutate(
        { id_group: id_group.toString() },
        {
          onSuccess: () => {
            router.push("/(user)/two");
          },
        }
      );
    }
  };

  const confirmVoidTransaction = () => {
    Alert.alert(
      "Confirm Void",
      "Are you sure you want to void this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: handleVoidTransaction,
        },
      ]
    );
  };

  console.log("id_void UPADTEEE", id_void);
  console.log("id_group UPADTEEE", id_group);
  if (!id_group) {
    return (
      <View style={styles.container}>
        <Text>Error: id_group is undefined</Text>
      </View>
    );
  }
  const { data: salesTransaction } = useSalesTransactionById(
    id_group.toString()
  );

  const { data: groupedSales } = use(id_group.toString());
  console.log("GROUPEDd SALES ADMINNN:", groupedSales);

  console.log("WHADBJHSBHA UPADTEEE", salesTransaction);
  const amount = salesTransaction?.[0]?.transactions?.[0]?.amount;
  const user = salesTransaction?.[0]?.created_by;
  const location = salesTransaction?.[0]?.id_branch.place;
  const createdAt = salesTransaction?.[0]?.created_at;
  const time = createdAt ? createdAt.split("T")[1].split(".")[0] : "";
  const sunMoon = time ? (time.split(":")[0] >= 12 ? "PM" : "AM") : "";
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  // const MemoizedProductListItem = memo(GroupedSalesTransactionItem); ayaw niya mag start sa 1, wtf.
  // const { data: groupedSales }: any = useGroupedSalesTransaction();
  let currentIdGroup = 1;

  const renderItem = ({ item }: { item: any }) => {
    const displayIdGroup = currentIdGroup;
    currentIdGroup++;
    console.log("TIME", item.created_at);
    const createdAtDate = item.created_at.split("T")[0];

    return (
      <GroupedSalesTransactionId
        id_products={item.id_products}
        id_group={item.id_group}
        id_number={displayIdGroup.toString()}
        amount={item.amount}
        created_at={createdAtDate}
        transactions={item.transactions}
        amount_by_product={item.amount_by_product}
        quantity={item.quantity}
      />
    );
  };

  const content = (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={confirmVoidTransaction}>
              <Text style={styles.confirmButton}>CONFIRM</Text>
            </Pressable>
          ),
        }}
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Quantity</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={salesTransaction}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_salestransaction}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{amount}</Text>
        <Text style={styles.createdBy}>Created by: {user}</Text>
        <Text style={styles.createdBy}>Location: {location}</Text>
        <Text style={styles.createdBy}>
          {time} {sunMoon}
        </Text>
      </View>
    </View>
  );

  const content2 = (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link
              href={`/(user)/transaction?id_group=${id_group}&id_void=1`}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <>
                    <Text style={styles.voidButton}>VOID</Text>
                  </>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Product</Text>
        <Text style={[styles.headerText, styles.statusMiddle]}>Quantity</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          Total Amount
        </Text>
      </View>
      <FlatList
        data={salesTransaction}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_salestransaction}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₱{amount}</Text>
        <Text style={styles.createdBy}>Created by: {user}</Text>
        <Text style={styles.createdBy}>Location: {location}</Text>
        <Text style={styles.createdBy}>
          {time} {sunMoon}
        </Text>
      </View>
    </View>
  );

  return id_void ? content : content2;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: "30%",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  dateContainer: {
    position: "absolute",
    top: 25,
    width: "100%", // Ensure the container takes full width
    alignItems: "center", // Center the children horizontally
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center", // Center the text
    
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
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
    paddingLeft: 10,
    flex: 1,
  },
  statusMiddle: {
    fontSize: 15,
    flex: 1,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    fontSize: 15,
    textAlign: "right",
    flex: 1,
    paddingRight: 10,
  },
  createdBy: {
    fontSize: 15,
    color: "gray",
  },
  voidButton: {
    color: "darkred",
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    color: "darkgreen",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Index;
