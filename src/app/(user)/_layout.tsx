import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";

import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useAuth();

  if (!session) {
    return <Link href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      {/* <Tabs.Screen name="category/index" options={{ href: null }} /> */}

      <Tabs.Screen
        name="two"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="cutlery" color={color} />
          ),
          tabBarButton: (props) => (
            <Link href="/(user)/category" asChild>
              <TouchableOpacity {...props} />
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="locations"
        options={{
          title: "loscs",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      {/* <Tabs.Screen
        name="two"
        options={{
          title: "losc",
          headerShown: false,
          tabBarButton: () => null,
        }}
      /> */}

      <Tabs.Screen
        name="category"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      {/* <Tabs.Screen
        name="transaction/index"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      /> */}
      {/* <Tabs.Screen
        name="transaction/PREV"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      /> */}

      <Tabs.Screen
        name="transaction"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="twoPREV"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="return"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
