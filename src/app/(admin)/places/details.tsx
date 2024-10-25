// src/screens/Details.tsx
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Details = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Location" }} />
      <Stack.Screen
        options={{
          title: "Location",
          headerRight: () => (
            // <Link href={`/(admin)/menu/`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  size={16}
                  color={"darkred"}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                >
                  Archive
                </FontAwesome>
              )}
            </Pressable>
            // </Link>
          ),
        }}
      />
      <Text style={styles.text}>Details Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Details;
