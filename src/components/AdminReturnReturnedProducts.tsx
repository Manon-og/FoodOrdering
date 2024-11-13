import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  created_at: string;
  id_branch: number;
  id_branch_place: string;
}

const GroupedReturnedItem: React.FC<GroupedSalesTransactionItemProps> = ({
  created_at,
  id_branch_place,
  id_branch,
}) => {
  //   console.log("id_group HEREEE", id_group);
  const link: any = `/(admin)/returned/details?id_branch=${id_branch}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{id_branch_place}</Text>
          <Text style={styles.itemText}>{created_at}</Text>
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
    paddingLeft: "50%",
  },
  itemLeft: {
    fontSize: 16,
    // fontWeight: "bold",
    flex: 1,
    textAlign: "left",
    paddingLeft: 10,
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

export default GroupedReturnedItem;
