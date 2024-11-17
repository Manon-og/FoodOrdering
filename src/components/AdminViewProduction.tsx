import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  created_at: string;
  location: string;

  quantity: number;
}

const AdminViewProduction: React.FC<GroupedSalesTransactionItemProps> = ({
  location,
  created_at,
  quantity,
}) => {
  const date = new Date(created_at).toISOString().split("T")[0];
  console.log("Date HIRRRRRRR:", date);
  const link: any = `/(admin)/productionreport?created_at=${created_at}&location=${location}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{location}</Text>
          <Text style={styles.itemText}>{date}</Text>
          <Text style={styles.itemRight}>{quantity}</Text>
        </View>
      </Pressable>
    </Link>
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
    // fontWeight: "bold",
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

export default AdminViewProduction;
