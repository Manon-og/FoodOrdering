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
  const place = branch?.map((item) => item.place);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);

  const onSelectBranch = (id_branch: string, branchName: string) => {
    setSelectedBranchName(branchName);
    router.push({
      pathname: "/(admin)/locations",
      params: { id_branch, branchName },
    });
  };

  return (
    <View style={styles.background}>
      <View style={styles.menuItems}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Transfer Products</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Returned Products</Text>
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
