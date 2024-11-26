import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryParams";

export default function MenuStack() {
  const category = useCategory();
  console.log("okay", category);

  const [title, setTitle] = useState("Back Inventory");
  const [hasNotification, setHasNotification] = useState(true);
  console.log("eqws:", title);

  useEffect(() => {
    setTitle(title);
  }, [title]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: title,
          headerRight: () => (
            <Link href="/(admin)/notification" asChild>
              <Pressable style={styles.notificationIconContainer}>
                <FontAwesome
                  name="bell"
                  size={24}
                  color="#0E1432"
                  style={{ marginRight: 15 }}
                />
                {hasNotification && <View style={styles.notificationBadge} />}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButtonText: {
    color: "#0E1432",
    fontSize: 16,
  },
  notificationIconContainer: {
    position: "relative",
    // marginRight: 15,
  },
  notificationBadge: {
    position: "absolute",
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "darkred",
  },
});
