import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryParams";
import { useBranchName } from "@/src/components/branchParams";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useBranchStore } from "@/store/branch";

export default function MenuStack() {
  const category = useCategory();
  console.log("okay", category);

  const { id_branch, branchName } = useBranchStore();
  console.log("location_layout:", id_branch);
  console.log("ZUSTANDSSS:", branchName);

  const { setBranchName, setIdBranch } = useByBranch();

  // useEffect(() => {
  //   setBranchName(branchName);
  //   setIdBranch(id_branch);
  // }, [branchName, id_branch, setBranchName, setIdBranch]);

  // console.log("id_branchs???", id_branch);
  // console.log("branchNames???", branchName);

  // const [id, setID] = useState(id_branch);
  // const [idName, setIDName] = useState(branchName);

  // useEffect(() => {
  //   setID(id_branch);
  //   setIDName(branchName);
  // }, [id_branch, branchName]);

  // const [title, setTitle] = useState(branchName);
  // console.log("asd:", branchName);
  // console.log("eqw:", title);

  // console.log("AAAs:", id_branch);

  // console.log("EEEs:", branchName);
  // console.log("EEEs:", idName);

  // console.log('PLEASEEEEEEE:', branchNames, id_branchs);

  // const fi = branchName || id_branch ? branchName : branchName;

  // useEffect(() => {
  //   setTitle(branchName ? branchName : 'Back Inventory');
  // }, [branchName]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: branchName,

          // headerLeft: () => (
          //   <Link href={`/(user)/category`} asChild>
          //     <Pressable style={styles.backButton}>
          //       {({ pressed }) => (
          //         <>
          //           <FontAwesome
          //             name="angle-left"
          //             size={24}
          //             color={Colors.light.tint}
          //             style={{ marginRight: 5, opacity: pressed ? 0.5 : 1 }}
          //           />
          //           <Text
          //             style={[
          //               styles.backButtonText,
          //               { opacity: pressed ? 0.5 : 1 },
          //             ]}
          //           >
          //             Back
          //           </Text>
          //         </>
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
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
