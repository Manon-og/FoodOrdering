import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

export default function MenuStack() {
  const change = "/(admin)/category";

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: `Returned Products`,
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
