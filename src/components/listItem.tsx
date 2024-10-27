import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

const ListItem = ({ item, isLocalBranch }: any) => {
  const handlePressDetails = () => {
    console.log("Branch:", item.id_branch);
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.placeContainer}>
        {item.id_archives !== 1 && (
          <View
            style={[
              styles.statusCircle,
              isLocalBranch ? styles.greenCircle : styles.grayCircle,
            ]}
          />
        )}
        <Text style={styles.placeText}>{item.place}</Text>
      </View>
      <Link href={`/places/details?id_branch=${item.id_branch}`} asChild>
        <TouchableOpacity onPress={handlePressDetails}>
          <Text
            style={[
              styles.detailsText,
              isLocalBranch ? styles.blueText : styles.grayText,
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
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
  },
  placeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.5,
  },
  statusCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  grayCircle: {
    backgroundColor: "gray",
  },
  greenCircle: {
    backgroundColor: "green",
  },
  placeText: {
    fontSize: 18,
    color: "#333",
  },
  detailsText: {
    fontSize: 18,
    flex: 1,
    textAlign: "right",
  },
  grayText: {
    color: "gray",
  },
  blueText: {
    color: "#007AFF",
  },
});

export default ListItem;
