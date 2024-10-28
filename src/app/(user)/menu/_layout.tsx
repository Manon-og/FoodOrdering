import { Stack } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";


export default function MenuStack() {
  return (
    <Stack
    screenOptions={
      {
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
          <Link href={'/(user)/category/'} asChild>
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
      }
    }
    > 
        <Stack.Screen name = "index" options = {{title : 'Menu'}} />
       
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