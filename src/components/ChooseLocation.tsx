import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Index from "@/src/app/(user)/two";

const GroupedSalesTransactionItem = ({ id_branch, branchName }: any) => {
  console.log("id_branchPOTA:", id_branch);
  console.log("branchNamePOTA:", branchName);
  return (
    <View style={styles.container}>
      <Link
        href={`/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`}
        asChild
      >
        <Pressable style={styles.pressable}>
          <Text style={styles.pressableText}>{branchName}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: 50, // Add padding at the topmost level
    // flexDirection: "row",
    // flexWrap: "wrap",
  },
  pressable: {
    width: "45%", // Adjust width to fit two items per row
    height: 100,
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  pressableText: {
    color: "black",
    fontStyle: "italic",
  },
});

export default GroupedSalesTransactionItem;
