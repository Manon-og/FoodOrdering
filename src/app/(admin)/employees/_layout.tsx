import { Stack } from "expo-router";
import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

export default function EmployeeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Employees",
          headerLeft: () => (
            <Link href="/profile" asChild>
              <Pressable style={styles.backButton}>
                <FontAwesome
                  name="angle-left"
                  size={35}
                  color={Colors.light.tint}
                />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            </Link>
          ),
          headerRight: () => (
            <Link href={`/employees/create`} asChild>
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

      {/* <Stack.Screen
        name="detail"
        options={{
          title: 'Employee Details',
        }}
      /> */}

      <Stack.Screen
        name="edit"
        options={{
          title: "Edit Employee",
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          title: "Create Employee",
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
