import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { Button } from "react-native-elements";
import { useBranch } from "@/src/api/products";
import BranchOptionsModal from "@/src/modals/branchModals";

const Index = () => {
  const router = useRouter();
  const { data: branch } = useBranch();
  console.log("branchs:", branch);
  const place = branch?.map((item) => item.place);
  console.log("place:", place);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(
    null
  );

  const onSelectBranch = (id_branch: string, branchName: string) => {
    console.log("Selected branch ID:", id_branch, branchName);
    setSelectedBranchName(branchName);
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

  return (
    <View style={styles.background}>
      <View style={styles.menuItems}>
      <TouchableOpacity style={styles.menuButton} onPress={handleNavigateStockIn}>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Stock In Products</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Transfer Products</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleNavigateReturn}>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Return Products</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
      <BranchOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        branches={branch || []}
        onSelectBranch={onSelectBranch}
        branchName={selectedBranchName}
      />
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
});
