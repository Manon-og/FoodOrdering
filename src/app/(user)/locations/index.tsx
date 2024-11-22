import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { useBranch } from "@/src/api/products";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchName } from "@/src/components/branchParams";
import Transaction from "@/src/app/(user)/two";
import { useBranchStore } from "@/src/store/branch";

const Index = () => {
  const { data: branch } = useBranch();
  console.log("branch:", branch);
  const place = branch?.map((item) => item.id_branch);
  console.log("place:", place);

  const { id_branch, branchName } = useBranchName();
  console.log("IDIDIDL:", id_branch);
  console.log("IDIDIDL:", branchName);

  const setBranchData = useBranchStore((state) => state.setBranchData);

  useEffect(() => {
    setBranchData(id_branch, branchName);
  }, [id_branch, branchName, setBranchData]);

  const { setBranchName, setIdBranch } = useByBranch();

  for (const pla of place ?? []) {
    console.log("place:", pla);
    console.log("id_branch:", { id_branch });
    if (pla.toString() === id_branch.toString()) {
      console.log("QQ:", id_branch);
      console.log("QQ:", branchName);
    }
  }

  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  console.log("id_branchs???", id_branch);
  console.log("branchNames???", branchName);

  const [id, setID] = useState(id_branch);
  const [idName, setIDName] = useState(branchName);

  useEffect(() => {
    setID(id_branch);
  }, [id_branch]);

  console.log("AAA:", id_branch);
  console.log("EEE:", id);

  const fi = id_branch ? id_branch : id;

  console.log("HERE:", id_branch);
  console.log("here:", branchName);

  const [showTransaction, setShowTransaction] = useState(false);
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Link
          href={`/(user)/menu?category=1&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>COOKIES</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=2&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=3&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=4&id_branch=${id_branch}&branchName=${branchName}`}
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
    marginTop: "10%",
    flexDirection: "row",
    flexWrap: "wrap",
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
