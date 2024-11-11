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
  background: {
    flex: 1,
    backgroundColor: "#B9D2F7",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: "30%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryCard: {
    width: "40%",
    height: 100,
    backgroundColor: "#FDFDFD",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
  },
  categoryText: {
    color: "black",
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuItems: {
    width: "90%",
    alignItems: "center",
  },
  menuButton: {
    backgroundColor: "#0E1432",
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
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
    fontWeight: "bold",
  },
  arrow: {
    color: "#FFFFFF",
    paddingLeft: 10,
  },
});
