import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useBranch } from "@/src/api/products";
import { Dropdown } from "react-native-element-dropdown";

const Index = () => {
  const router = useRouter();
  const { data: branch } = useBranch();
  console.log("branches:", branch);

  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const handleSelectBranch = (id_branch: string, branchName: string) => {
    console.log("Selected branch ID:", id_branch, branchName);
    setSelectedBranchName(branchName); // Store selected branch name
    setSelectedBranchId(id_branch);   // Store selected branch ID
    router.push({
      pathname: "/(admin)/locations",
      params: { id_branch, branchName },
    });
  };

  const handleNavigateStockIn = () => {
    router.push("/(admin)/category/quantity");
  };

  const handleNavigateReturn = () => {
    router.push("/(admin)/returned");
  };

  // Branches dropdown options
  const branchOptions = branch?.map((item) => ({
    label: item.place,
    value: item.id_branch,
  })) || [];

  return (
    <View style={styles.background}>
      <View style={styles.menuItems}>
        {/* Transfer Products Dropdown */}
        <View style={styles.locationContainer}>
          <Dropdown
            data={branchOptions}
            labelField="label"
            valueField="value"
            value={selectedBranchId}  
            onChange={(item) => handleSelectBranch(item.value, item.label)}
            placeholder={selectedBranchId ? selectedBranchName ?? undefined : "Transfer Products"}  
            placeholderStyle={styles.placeholderText}
            style={styles.dropdown}
            renderItem={(item) => (
              <View style={styles.dropdownItem}>
                <Text>{item.label}</Text>
              </View>
            )}
          />
        </View>
        <TouchableOpacity style={styles.menuButton} onPress={handleNavigateStockIn}>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Stock In Products</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={handleNavigateReturn}>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Return Products</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Link href={`/(admin)/menu?category=1`} asChild>
        <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>COOKIE</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=2`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=3`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=4`} asChild>
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>BENTO CAKES</Text>
          </Pressable>
        </Link>
      </View>
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
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "10%",
  },
  categoryCard: {
    width: "40%",
    height: "33%",
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
    marginTop: 10,
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
  locationContainer: {
    width: "90%",
    marginTop: 20,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#0E1432",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: "#0E1432",
    fontWeight: "bold",
  },
  dropdownItem: {
    padding: 10,
    color: "#FFFFFF",
  },
  placeholderText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
    fontWeight: "bold",
    paddingLeft: "1%",
  },
});
