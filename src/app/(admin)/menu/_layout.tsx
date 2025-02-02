import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryParams";
import { useBranchName } from "@/src/components/branchParams";
import { useByBranch } from "@/src/providers/BranchProvider";
import { useArchivedParams } from "@/components/archivedParams";

export default function MenuStack() {
  const category = useCategory();
  console.log('okay', category);

  const { id_archive } = useArchivedParams();
  const { id_branch, branchName } = useBranchName();
  console.log('))):', id_branch);
  console.log('))):', branchName);
  const {setBranchName, setIdBranch } = useByBranch();
  console.log('((())):', branchName);
  console.log('((()))))):', id_branch);

  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  console.log('assd:', branchName, id_branch);
  const change = id_branch ? `/(admin)/locations?id_branch=${id_branch}&&branchName=${branchName}` : '/(admin)/category';
  console.log('change:', change);

  const pageTitle = id_archive ? `Archived Products` : `Menu`;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: `${pageTitle}`,
          headerRight: () => (
            id_archive ? null : !id_branch && (
              <Link href={`/(admin)/menu/create?category=${category}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="plus-square-o"
                      size={25}
                      color={"Colors.light.tint"}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            )
          ),
          headerLeft: () => (
            <Link href={id_archive ? `/(admin)/archive` : `${change}`} asChild>
              <Pressable style={styles.backButton}>
                {({ pressed }) => (
                  <>
                    <FontAwesome
                      name="angle-left"
                      size={35}
                      color={"#0E1432"}
                      style={{ marginRight: 5, opacity: pressed ? 0.5 : 1 }}
                    />
                    <Text style={[styles.backButtonText, { opacity: pressed ? 0.5 : 1 }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8.5,
    paddingBottom: 4,
  },
  backButtonText: {
    color: "#0E1432",
    fontSize: 18,
  },
});