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
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const router = useRouter();
  const { data: branch } = useBranch();
  const filteredBranch = branch?.filter((item) => item.place !== "inStore");
  console.log("branchs:", branch);
  const place = branch
    ?.map((item) => item.place)
    .filter((place) => place !== "inStore");
  console.log("place:", place);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(
    null
  );

  const transactionId = uuidv4();
  // console.log("transactionId", transactionId);

  const onSelectBranch = (id_branch: string, branchName: string) => {
    console.log("Selected branch ID:", id_branch, branchName);
    setSelectedBranchName(branchName);
    router.push({
      pathname: "/(user)/locations",
      params: { id_branch, branchName },
    });
  };

  return (
    <View>
      <View style={styles.menuItems}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Choose Location</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      <BranchOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        branches={filteredBranch || []}
        onSelectBranch={onSelectBranch}
        branchName={selectedBranchName}
      />
      <View style={styles.container}>
        <Link
          href={`/(user)/menu?category=1&id_branch=1&branchName=inStore`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>COOKIE</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=2&id_branch=1&branchName=inStore`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=3&id_branch=1&branchName=inStore`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=4&id_branch=1&branchName=inStore`}
          asChild
        >
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
