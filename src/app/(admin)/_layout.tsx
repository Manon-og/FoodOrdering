import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useNavigation } from "expo-router";
import { Pressable, TouchableOpacity } from "react-native";

import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.background,
        headerShown: useClientOnlyValue(false, true),
        tabBarInactiveTintColor: "gainboro",
        tabBarStyle: { backgroundColor: Colors.light.tint },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      {/* <Tabs.Screen name = "location" options = {{ href: null}} /> */}

      <Tabs.Screen
        name="category"
        options={{
          title: "nothing",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="locations"
        options={{
          title: "losc",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="archive"
        options={{
          title: "losc",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

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
            <Link href="/(admin)/category" asChild>
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
        name="employees/create"
        options={{
          title: "Create Employee",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="employees/index"
        options={{
          title: "Create Employee",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="employees/EmployeeForm"
        options={{
          title: "Create Employee",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="employees/edit"
        options={{
          title: "edit Employee",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      {/* <Tabs.Screen
        name="places/index"
        options={{
          title: "add Location",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="places/addLocation"
        options={{
          title: "add Location",
          headerShown: false,
          tabBarButton: () => null,
        }}
      /> */}

      <Tabs.Screen
        name="places"
        options={{
          title: "add Location",
          headerShown: false,
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
