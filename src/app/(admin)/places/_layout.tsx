import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

export default function MenuStack() {
  const change = "/(admin)/profile";

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: `Locations`,
          headerLeft: () => (
            <Link href={`${change}`} asChild>
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
          headerRight: () => (
            <Link href={`/(admin)/places/addLocation`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-square-o"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
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
    color: "#0E1432",
    fontSize: 18,
  },
});