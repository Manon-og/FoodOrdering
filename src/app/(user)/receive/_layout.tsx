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

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFD895",
        },
        headerLeft: () => (
          <Link
            href={`/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`}
            asChild
          >
            <Pressable style={styles.backButton}>
              {({ pressed }) => (
                <>
                  <FontAwesome
                    name="angle-left"
                    size={35}
                    color={"#0E1432"}
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
    >
      <Stack.Screen
        name="index"
        options={{
          title: branchName,
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
    color: "#0E1432",
    fontSize: 18,
  },
});
