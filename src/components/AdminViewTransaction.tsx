import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  created_at: string;
  created_by: string;
  amount_by_product: number;
  place: number;
  id_branch: number;
}

const AdminViewTransaction: React.FC<GroupedSalesTransactionItemProps> = ({
  place,
  created_at,
  created_by,
  amount_by_product,
  id_branch,
}) => {
  const date = new Date(created_at).toISOString().split("T")[0];
  console.log("Date HIRRRRRRR:", date);
  const link: any = `/(admin)/salesreport?id_branch=${id_branch}&created_at=${date}&created_by=${created_by}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{place}</Text>
          <Text style={styles.itemText}>{date}</Text>
          <Text style={styles.itemRight}> {amount_by_product}</Text>
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

export default AdminViewTransaction;
