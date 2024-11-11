import { View, StyleSheet, FlatList } from "react-native";
import React, { memo, useState } from "react";

import { useBranch } from "@/src/api/products";

import ChooseLocation from "@/components/ChooseLocation";

const Index = () => {
  const { data: branch } = useBranch();

  console.log("branchsPOTA>:", branch);
  const place = branch
    ?.map((item) => item.place)
    .filter((place) => place !== "inStore");
  console.log("place:", place);

  const MemoizedChooseLocation = memo(ChooseLocation);
  const renderItem = ({ item }: { item: any }) => {
    return (
      <MemoizedChooseLocation
        id_branch={item.id_branch}
        branchName={item.place}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={branch}
        keyExtractor={(item) => item.id_branch.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pressable: {
    width: "40%",
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
  location: {
    margin: 10,
    marginLeft: "30%",
    width: "40%",
  },

  profileHeader: {
    alignItems: "center",
    paddingBottom: "40%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 18,
    color: "gray",
  },
  menuItems: {
    width: "80%",
    marginLeft: "10%",
    alignItems: "center",
  },
  menuButton: {
    backgroundColor: "lightblue",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
  },
  menuTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    paddingLeft: 10,
  },
});
