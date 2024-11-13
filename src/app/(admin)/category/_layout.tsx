import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Pressable } from "react-native";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { useCategory } from "@/src/components/categoryParams";


export default function MenuStack() {
  const category = useCategory();
  console.log('okay',category);

  const [title, setTitle] = useState('Back Inventory');

  console.log('eqws:', title); 

  useEffect(() => {
    setTitle(title);
  }, [title]);

  return (
    <Stack> 
        <Stack.Screen 
        name = "index" 
        options = {{
         title : title,
         }} />
    </Stack>
  );
}