import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Link, useRouter } from "expo-router";
import { useBranch } from "@/src/api/products";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect } from "@react-navigation/native";
import useUpdateBranchChannel from "@/app/channel/useUpdateBranch";

const Index = () => {
  const { data: branch, refetch: branchRef } = useBranch();
  useUpdateBranchChannel(() => {
    console.log("Change recsseived!");
    branchRef();
  });

  const router = useRouter();

  console.log("branches:", branch);

  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(
    null
  );
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const handleSelectBranch = (id_branch: string, branchName: string) => {
    setSelectedBranchName(branchName); // Store selected branch name
    setSelectedBranchId(id_branch); // Store selected branch ID
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
  const branchOptions =
    branch?.map((item) => ({
      label: item.place,
      value: item.id_branch,
    })) || [];

  // Reset selectedBranchId and selectedBranchName when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setSelectedBranchId(null);
      setSelectedBranchName(null);
    }, [])
  );

  return (
    <View style={styles.background}>
      <View style={styles.menuItems}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleNavigateStockIn}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Stock In Products</Text>
          </View>
        </TouchableOpacity>

        {/* Transfer Products Dropdown */}
        <View style={styles.locationContainer}>
          <Dropdown
            data={branchOptions}
            labelField="label"
            valueField="value"
            value={selectedBranchId}
            onChange={(item) => handleSelectBranch(item.value, item.label)}
            placeholder="Transfer Products"
            placeholderStyle={styles.placeholderText} // White color for placeholder
            style={styles.dropdown}
            renderItem={(item) => (
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item.label}</Text>
              </View>
            )}
            selectedTextStyle={selectedBranchId ? styles.selectedText : null} // Make selected text white
          />
        </View>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleNavigateReturn}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Returned Products</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <Link href={`/(admin)/menu?category=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/cookies.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>COOKIES</Text>
          </Pressable>
        </Link>

        <Link href={`/(admin)/menu?category=2`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/bread.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>

        <Link href={`/(admin)/menu?category=3`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/cakes.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>

        <Link href={`/(admin)/menu?category=4`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/bentocakes.png")}
              style={styles.categoryImage}
            />
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
  categoryCard: {
    width: "40%",
    height: "40%",
    backgroundColor: "#FDFDFD",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
    overflow: "hidden", // To prevent image overflow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  categoryImage: {
    width: "100%",
    height: "81%",
    resizeMode: "cover",
    marginBottom: 10,
    marginTop: "-12%",
  },
  categoryText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    marginTop: 2,
  },
  locationContainer: {
    width: "90%",
    marginTop: 10,
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
    color: "#000000", // Default black color for dropdown items
    fontWeight: "bold",
  },
  dropdownText: {
    color: "#000000", // Black color for dropdown items when not selected
  },
  placeholderText: {
    color: "#FFFFFF", // White color for the placeholder
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: "1%",
  },
  selectedText: {
    color: "#FFFFFF", // White for selected item text
    fontSize: 16,
    fontWeight: "bold",
    paddingLeft: "1%",
  },
});
