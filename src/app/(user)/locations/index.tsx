import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { useBranch, useGetReceivePendingStocks } from "@/src/api/products";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchName } from "@/src/components/branchParams";
import Transaction from "@/src/app/(user)/two";
import { useBranchStore } from "@/src/store/branch";

const Index = () => {
  const { data: branch } = useBranch();
  const place = branch?.map((item) => item.id_branch);

  const { id_branch, branchName } = useBranchName();
  const { data: viewPendingProducts } = useGetReceivePendingStocks(id_branch);
  console.log("viewPendingProductssw:", viewPendingProducts);

  const setBranchData = useBranchStore((state) => state.setBranchData);

  useEffect(() => {
    setBranchData(id_branch, branchName);
  }, [id_branch, branchName, setBranchData]);

  const { setBranchName, setIdBranch } = useByBranch();

  for (const pla of place ?? []) {
    if (pla.toString() === id_branch.toString()) {
      // Handle branch data
    }
  }

  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  const [id, setID] = useState(id_branch);
  const [idName, setIDName] = useState(branchName);

  useEffect(() => {
    setID(id_branch);
  }, [id_branch]);

  const [showTransaction, setShowTransaction] = useState(false);
  const router = useRouter();
  const handleNavigatReveive = () => {
    router.push(
      `/(user)/receive?id_branch=${id_branch}&branchName=${branchName}`
    );
  };

  return (
    <View style={styles.background}>
      <View style={styles.buttonContainer}>
        {viewPendingProducts && viewPendingProducts.length > 0 ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleNavigatReveive}
          >
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Accept Incoming Stocks</Text>
            </View>
          </TouchableOpacity>
        ) : null}
        {/* <TouchableOpacity
          style={styles.menuButton}
          onPress={handleNavigatReveive}
        >
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Accept Incoming Stocks</Text>
          </View>
        </TouchableOpacity> */}
      </View>

      <View style={styles.container}>
        <Link
          href={`/(user)/menu?category=1&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/cookies.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>COOKIES</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=2&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/bread.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=3&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/cakes.png")}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link
          href={`/(user)/menu?category=4&id_branch=${id_branch}&branchName=${branchName}`}
          asChild
        >
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
    backgroundColor: "#FFD895",
    alignItems: "center",
  },
  buttonContainer: {
    height: 60, // Adjust the height as needed
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: "5%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryCard: {
    width: "40%",
    height: "40%",
    backgroundColor: "white",
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
    height: "81%", // Adjust the height as needed
    resizeMode: "cover",
    marginBottom: 10, // Space between image and text
    marginTop: "-12%",
  },
  categoryText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  menuButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  menuTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    color: "black",
    fontSize: 16,
    flex: 1,
    fontWeight: "bold",
  },
});
