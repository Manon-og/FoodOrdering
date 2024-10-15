import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useBranchName } from "@/src/components/branchParams";
import { useByBranch } from "@/src/providers/BranchProvider";

export default function MenuStack() {
  const { id_branch, branchName } = useBranchName();
  const {setBranchName, setIdBranch } = useByBranch();


  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  const change = '/(admin)/profile';

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: `Archive`,
        
          headerLeft: () => (
            <Link href={`${change}`} asChild>
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