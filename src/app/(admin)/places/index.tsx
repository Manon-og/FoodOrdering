import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { useBranchData, useLocalBranchData } from "@/src/api/products";
import { Picker } from "@react-native-picker/picker";
import ListItem from "@/src/components/listItem";
import { Link } from "expo-router";
import Button from "@/src/components/Button";

const Index = () => {
  const { data: branch } = useBranchData();
  const { data: localBranch } = useLocalBranchData();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBranch, setFilteredBranch] = useState<any[]>([]);

  useEffect(() => {
    if (branch) {
      let filtered = branch;

      // Apply filter based on selected status
      if (selectedFilter !== "all") {
        filtered = filtered.filter(
          (item: any) => item.status?.toLowerCase() === selectedFilter
        );
      }

      // Apply search query filter
      if (searchQuery !== "") {
        filtered = filtered.filter((item: any) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredBranch(filtered);
    }
  }, [branch, selectedFilter, searchQuery]);

  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const renderItem = ({ item }: any) => {
    const isLocalBranch = localBranch?.some(
      (localItem) => localItem.id_branch === item.id_branch
    );
    const statusColor =
      item.status === "active"
        ? styles.greenCircle
        : item.status === "inactive"
        ? styles.grayCircle
        : null;
    return (
      <View style={styles.listItem}>
        {statusColor && <View style={[styles.statusCircle, statusColor]} />}
        <ListItem item={item} isLocalBranch={isLocalBranch} />
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
        <Picker
          selectedValue={selectedFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedFilter(itemValue)}
        >
          <Picker.Item label="All Locations" value="all" />
          <Picker.Item label="Active Locations" value="active" />
          <Picker.Item label="Inactive Locations" value="inactive" />
          <Picker.Item label="Archived Locations" value="archived" />
        </Picker>
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
      <View>
        <Link href="/places/overview" asChild>
          <Button text={"INVENTORY OVERVIEW"} />
        </Link>
      </View>
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
  filterContainer: {
    width: "100%",
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    height: 40,
    width: "100%",
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
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
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
