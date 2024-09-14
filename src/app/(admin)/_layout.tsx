import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
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
        tabBarInactiveTintColor: 'gainboro',
        tabBarStyle: { backgroundColor: Colors.light.tint },
      }}>

       <Tabs.Screen name = "index" options = {{ href: null}} />
       {/* <Tabs.Screen name = "Category" options = {{ href: null}} /> */}


       <Tabs.Screen
        name="category"
        options={{
          title: 'nothing',
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color }) => 
          <TabBarIcon name="cutlery" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="two"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => 
          <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
