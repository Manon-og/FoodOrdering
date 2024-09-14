import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryWTF";


export default function MenuStack() {
  const category = useCategory();
  console.log('okay',category);

  return (
    <Stack> 
        <Stack.Screen 
        name = "index" 
        options = {{
         title : 'Category',
         headerRight: () => (
          <Link href={`/(admin)/category/quantity`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="cart-plus"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        ),}} />
    </Stack>
  );
}