import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useBranchName } from "@/components/branchParams";

export default function MenuStack() {
  const { id_branch, branchName } = useBranchName();
  const [title, setTitle] = useState("In Store");

  useEffect(() => {
    setTitle(branchName ? branchName : "In Store");
  }, [branchName]);

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Link href="/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="shopping-cart"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),
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
      <Stack.Screen name="index" options={{ title: title }} />
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
