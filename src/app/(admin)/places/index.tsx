import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import {
  useBranchData,
  useLocalBranchData,
  useRealLocalBranchData,
} from "@/src/api/products";
import { Dropdown } from "react-native-element-dropdown"; // Dropdown import
import ListItem from "@/src/components/listItem";
import { Link } from "expo-router";
import Button from "@/src/components/Button";
import useUpdateBranchChannel from "@/app/channel/useUpdateBranch";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const Index = () => {
  // const { data: branch, refetch: branchRef } = useBranch();
  // useUpdateBranchChannel(() => {
  //   branchRef();
  // });
  const { data: branch, refetch: branchRef } = useBranchData();
  const { data: localBranch } = useLocalBranchData();
  console.log("0213d:", localBranch);

  const { data: realLocalBranch } = useRealLocalBranchData();

  const [selectedFilter, setSelectedFilter] = useState<string | null>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBranch, setFilteredBranch] = useState<any[]>([]);
  const [isFocus, setIsFocus] = useState(false);

  console.log("---s--", branch);

  useEffect(() => {
    if (branch) {
      let filtered = branch;

      if (selectedFilter && selectedFilter !== "all") {
        filtered = filtered.filter((item: any) => {
          const isLocalBranch2 = localBranch?.some(
            (localItem) => localItem.id_branch === item.id_branch
          );
          const isLocalBranch1 = realLocalBranch?.some(
            (localItem) => localItem.id_branch === item.id_branch
          );

          if (selectedFilter === "active") {
            return isLocalBranch1 || isLocalBranch2;
          } else if (selectedFilter === "inactive") {
            return !isLocalBranch1 && !isLocalBranch2 && item.id_archives !== 1;
          } else if (selectedFilter === "archived") {
            return item.id_archives === 1;
          }
          return true;
        });
      }

      if (searchQuery !== "") {
        filtered = filtered.filter((item: any) =>
          item.place.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredBranch(filtered);
    }
  }, [branch, localBranch, realLocalBranch, selectedFilter, searchQuery]);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  console.log("++++++???", filteredBranch);

  const renderItem = ({ item }: any) => {
    const isLocalBranch = localBranch?.some(
      (localItem) => localItem.id_branch === item.id_branch
    );
    const isLocalBranch2 = realLocalBranch?.some(
      (localItem) => localItem.id_branch === item.id_branch
    );

    console.log("++++++???", isLocalBranch);

    const statusLabel = isLocalBranch ? "Active" : "Inactive";

    return (
      <View style={styles.listItem}>
        {/* <Text style={styles.statusText}>{statusLabel}</Text> */}
        <ListItem
          item={item}
          isLocalBranch={isLocalBranch}
          isRealLocalBranch={isLocalBranch2}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{currentDay}</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={statusOptions}
          labelField="label"
          valueField="value"
          placeholder="Filter by Status"
          value={selectedFilter}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setSelectedFilter(item.value);
            setIsFocus(false);
          }}
        />
      </View>

      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, styles.statusHeader]}>Status</Text>
        <Text style={[styles.headerText, styles.moreInfoHeader]}>
          More Info
        </Text>
      </View>

      <FlatList
        data={filteredBranch}
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
    paddingTop: "25%",
  },
  dateContainer: {
    position: "absolute",
    top: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  dayText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#0E1432",
  },
  filterContainer: {
    flexDirection: "row", // Align Search Bar and Dropdown side by side
    width: "100%",
    marginBottom: 10,
    justifyContent: "space-between", // Add space between the items
  },
  searchBar: {
    height: 40,
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  dropdown: {
    height: 40,
    width: 150,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
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
  moreInfoHeader: {
    textAlign: "right",
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 16,
    marginRight: 10,
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
});

export default Index;
