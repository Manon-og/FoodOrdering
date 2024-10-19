import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useBranchData, useLocalBranchData } from "@/src/api/products";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();
  console.log("lllll", branch);
  console.log("xxxxxxxx", localBranch);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const renderItem = ({ item }: any) => {
    const isLocalBranch = localBranch?.some(
      (localItem) => localItem.id_branch === item.id_branch
    );

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
        <TouchableOpacity>
          <Text
            style={[
              styles.detailsText,
              isLocalBranch ? styles.blueText : styles.grayText,
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Status</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          More Info
        </Text>
      </View>
      <FlatList
        data={branch}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_branch.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: "30%",
  },
  dateContainer: {
    position: "absolute",
    top: 50,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
  dayText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 13,
    color: "green",
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
    textAlign: "left",
    flex: 0.5,
  },
  placeHeader: {
    textAlign: "left",
    flex: 1.5,
  },
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
  },
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
  blackText: {
    color: "black",
  },
  blueText: {
    color: "#007AFF",
  },
});

export default Index;
