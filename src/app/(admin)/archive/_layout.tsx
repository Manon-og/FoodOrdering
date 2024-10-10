import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryParams";
import { useBranchName } from "@/src/components/branchParams";
import { useByBranch } from "@/src/providers/BranchProvider";

export default function MenuStack() {
  const category = useCategory();
  console.log('okay', category);


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

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: `Archives`,
        
          headerLeft: () => (
            <Link href={`${change}:any`} asChild>
              <Pressable style={styles.backButton}>
                {({ pressed }) => (
                  <>
                    <FontAwesome
                      name="angle-left"
                      size={35}
                      color={Colors.light.tint}
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
    color: Colors.light.tint,
    fontSize: 18,
  },
});