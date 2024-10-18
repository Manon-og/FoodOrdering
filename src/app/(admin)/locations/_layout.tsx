import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryParams";
import { useBranchName } from "@/src/components/branchParams";
import { useByBranch } from "@/src/providers/BranchProvider";

export default function MenuStack() {
  const category = useCategory();
  console.log("okay", category);

  const { branchName, id_branch } = useBranchName();
  console.log("id_branchASJDASJDAKSDs:", branchName);
  console.log("id_branchASJDASJDAKSDs:", id_branch);
  // const { branchNames, id_branchs, setBranchName, setIdBranch } = useByBranch();

  // useEffect(() => {
  //   setBranchName(branchName);
  //   setIdBranch(id_branch);
  // }, [branchName, id_branch, setBranchName, setIdBranch]);

  // const [id, setid] = useState(id_branch);
  // console.log('asd2:', id_branch);
  // console.log('eqw2:', id);

  const { setBranchName, setIdBranch } = useByBranch();

  // for (const pla of place ?? []) {
  //   console.log('place:', pla);
  //   console.log('id_branch:', {id_branch});
  //   if (pla.toString() === id_branch.toString()) {
  //     console.log('QQ:', id_branch);
  //     console.log('QQ:', branchName);
  //   }
  // }

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
    setIDName(branchName);
  }, [id_branch, branchName]);

  const [title, setTitle] = useState(branchName);
  console.log("asd:", branchName);
  console.log("eqw:", title);

  console.log("AAAs:", id_branch);

  console.log("EEEs:", branchName);
  console.log("EEEs:", idName);

  // console.log('PLEASEEEEEEE:', branchNames, id_branchs);

  const fi = branchName || id_branch ? branchName : branchName;

  // useEffect(() => {
  //   setTitle(branchName ? branchName : 'Back Inventory');
  // }, [branchName]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: fi,
          headerRight: () => (
            <Link
              href={`/(admin)/locations/quantity?id_branch=${id_branch}&branchName=${branchName}`}
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="cart-plus"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerLeft: () => (
            <Link href={`/(admin)/category`} asChild>
              <Pressable style={styles.backButton}>
                {({ pressed }) => (
                  <>
                    <FontAwesome
                      name="angle-left"
                      size={24}
                      color={Colors.light.tint}
                      style={{ marginRight: 5, opacity: pressed ? 0.5 : 1 }}
                    />
                    <Text
                      style={[
                        styles.backButtonText,
                        { opacity: pressed ? 0.5 : 1 },
                      ]}
                    >
                      Back
                    </Text>
                  </>
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -8.5,
    paddingBottom: 4,
  },
  backButtonText: {
    color: Colors.light.tint,
    fontSize: 18,
  },
});
