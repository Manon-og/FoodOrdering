import { useWarningByBranch } from "@/api/products";
import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface GroupedSalesTransactionItemProps {
  created_at: string;
  id_branch: number;
  id_branch_place: string;
  item: any;
}

const GroupedReturnedItem: React.FC<GroupedSalesTransactionItemProps> = ({
  created_at,
  id_branch_place,
  id_branch,
  item,
}) => {
  console.log("ODASNJKDAS", id_branch);
  const { data: branch } = useWarningByBranch(id_branch);

  const dateNow = new Date();

  const yearNOW = dateNow.getFullYear();
  const monthNOW = String(dateNow.getMonth() + 1).padStart(2, "0");
  const dayNOW = String(dateNow.getDate()).padStart(2, "0");
  const currentDate = `${yearNOW}-${monthNOW}-${dayNOW}`;

  console.log("Current Date DISPLAY:", currentDate);
  const expire: any = [];
  const expired: any = [];

  if (branch) {
    branch.forEach((item: any) => {
      console.log("RETURNED Expire Date!!!!!:", item.id_batch.expire_date);
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
  console.log("OUTSIDEE", expired);
  let warningDisplayed = false;

  console.log("Branch EXPIRE:", branch);
  const link: any = `/(admin)/returned/details?id_branch=${id_branch}`;
  return (
    <Link href={link} asChild>
      <Pressable>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLeft}>{id_branch_place}</Text>
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

          <Text style={styles.itemText}>{created_at}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingLeft: 10,
    paddingRight: 10,
  },

  itemText: {
    fontSize: 16,
    textAlign: "center",
    flex: 1,
    paddingLeft: "40%",
  },
  itemLeft: {
    fontSize: 16,
    textAlign: "left",
    paddingLeft: "10%",
  },
});

export default GroupedReturnedItem;
