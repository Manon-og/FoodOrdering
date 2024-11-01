import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useAuthenticationLevel } from "@/api/products";

const index = () => {
  const { session, loading } = useAuth();
  console.log("HELLO{}??", session);
  const id = session?.user.id ?? "";
  console.log("HELLO{ble}??", id);

  const { data: user } = useAuthenticationLevel(id);
  console.log(
    "profile",
    user?.map((user) => user.id_roles)
  );

  const role = user?.map((user) => user.id_roles);
  console.log("role pPPOTA", role);

  if (role && role[0] === 1) {
    console.log("admin");
    return <Redirect href={"/(admin)"} />;
    console.log("admin");
  }

  if (role && role[0] === 2) {
    console.log("user");
    return <Redirect href={"/(user)"} />;
    console.log("user");
  }

  if (loading) {
    <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  // return (
  //   <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
  //     <Link href={"/(user)"} asChild>
  //       <Button text="Staff" />
  //     </Link>
  //     <Link href={"/(admin)"} asChild>
  //       <Button text="Admin" />
  //     </Link>

  //     <Button onPress={() => supabase.auth.signOut()} text="Sign out" />
  //   </View>
  // );
};

export default index;
