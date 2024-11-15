import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useSalesTransactionById } from "@/api/products";

export default function MenuStack() {
  //   const { id_group } = useLocalSearchParams();
  //   const { data: salesTransaction } = useSalesTransactionById(
  //     id_group.toString()
  //   );

  //   const idGroup = salesTransaction?.[0]?.id_group;
  //   console.log("id_group dito ", idGroup);

  //   console.log("iddd ", id_group);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",

          headerLeft: () => (
            <Link href={`/(user)/profile`} asChild>
              <Pressable style={styles.backButton}>
                {({ pressed }) => (
                  <>
                    <FontAwesome
                      name="angle-left"
                      size={24}
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
  voidButton: {
    color: "darkred",
    fontSize: 18,
    fontWeight: "bold",
  },
});
