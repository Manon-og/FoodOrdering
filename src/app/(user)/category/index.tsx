import React, { memo, useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TextInput, Text } from "react-native";
import { useBranch } from "@/src/api/products";
import ChooseLocation from "@/src/components/ChooseLocation";
import { useLogoutStore } from "@/store/logout";

const Index = () => {
  const { data: branch }: any = useBranch();
  const [searchText, setSearchText] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    if (branch) {
      setFilteredLocations(branch);
    }
  }, [branch]);

  const filterLocations = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredLocations(branch);
    } else {
      const filtered = branch?.filter((item: any) =>
        item.place.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  };

  console.log("branchsPOTA>:", branch);
  console.log("filteredLocations:", filteredLocations);

  const MemoizedChooseLocation = memo(ChooseLocation);
  const renderItem = ({ item }: { item: any }) => {
    return (
      <MemoizedChooseLocation
        id_branch={item.id_branch}
        branchName={item.place}
        style={styles.card}
      />
    );
  };

  const setStatus = useLogoutStore((state) => state.setStatus);

  useEffect(() => {
    setStatus("restart");
  }, [setStatus]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search locations..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={filterLocations}
      />

      {filteredLocations?.length === 0 && (
        <Text style={styles.noResultsText}>No locations found</Text>
      )}

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id_branch.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD895",
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#0E1432",
    backgroundColor: "#FDFDFD",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    color: "#0E1432",
  },
  noResultsText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginVertical: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Index;
