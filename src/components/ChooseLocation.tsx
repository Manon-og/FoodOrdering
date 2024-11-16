import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "@/constants/Colors"; 
const ChooseLocation = ({ id_branch, branchName }: any) => {
  console.log("id_branchPOTA:", id_branch);
  console.log("branchNamePOTA:", branchName);
  return (
    <View style={styles.container}>
      <Link
        href={`/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`}
        asChild
      >
        <Pressable style={styles.card}>
          <Text style={styles.cardText}>{branchName}</Text>
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
    marginTop: 20,
    backgroundColor: "#B9D2F7",
  },
  card: {
    width: "90%", 
    backgroundColor: Colors.light.background, 
    borderRadius: 10,
    padding: 18,
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    color: Colors.light.text, 
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChooseLocation;