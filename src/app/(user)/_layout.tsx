import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useSegments } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";

import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useBranchStore } from "@/src/store/branch";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session } = useAuth();
  const { id_branch, branchName } = useBranchStore();
  const segments: string[] = useSegments(); // get the current route segments

  console.log("MENU BUTTON:", id_branch);
  console.log("Curr Segmentz:", segments);

  if (!session) {
    return <Link href="/" />;
  }

  // if (!id_branch) {
  //   return <Link href="/(user)/category" />;
  // }

  // Determine if the tab bar should be hidden
  const hide = segments.includes("category");
  const hide2 = segments.includes("salesreport");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#510C0A",
        headerShown: useClientOnlyValue(false, true),
        tabBarInactiveTintColor: "#642826",
        tabBarStyle: {
          backgroundColor: "#FFD895",
          display: hide || hide2 ? "none" : "flex", // hide magic tab
        },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
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
            <Link
              href={`/(user)/locations?id_branch=${id_branch}&branchName=${branchName}`}
              asChild
            >
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

      <Tabs.Screen
        name="category"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="transaction"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      {/* <Tabs.Screen
        name="twoPREV"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      /> */}

      <Tabs.Screen
        name="return"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="cashcount"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="salesreport"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
