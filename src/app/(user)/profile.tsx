import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router"; // Import Link and useRouter components
import {
  handleLogout,
  getUserEmail,
  getUserFullName,
  getEmployeeUUID,
  useAuthenticationLevel,
} from "@/api/products"; // Import handleLogout and getUserEmail functions
import { useBranchName } from "@/components/branchParams";
import { useAuth } from "@/providers/AuthProvider";
import { useBranchStore } from "@/store/branch";
import { useUUIDStore } from "@/store/user";
import Colors from "@/constants/Colors";

export default function UserProfile() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const { session, loading } = useAuth();
  const idAuth = session?.user.id ?? "";
  const { data: user } = useAuthenticationLevel(idAuth);

  console.log(
    "profile",
    user?.map((user) => user.id_roles)
  );

  const role = user?.map((user) => user.id_roles);

  const { id_branch, branchName } = useBranchStore();
  console.log("PROFILEE:", id_branch);
  console.log("PROFILEE:", branchName);

  const { data: UUID } = getEmployeeUUID(email ?? "");
  console.log("PROFILEE UUDI:", UUID);

  const id = UUID?.[0]?.id;
  console.log("PROFILEE UUDI:", id);

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = await getUserEmail();
      setEmail(userEmail);

      const userFullName = await getUserFullName();
      setFullName(userFullName);
    };
    fetchUserData();
  }, []);

  const setId = useUUIDStore((state) => state.setId);

  useEffect(() => {
    setId(id);
  }, [id, setId]);

  return (
    <View style={styles.container}>
      <View style={styles.topButton}>
        <Text onPress={() => handleLogout(router)} style={styles.logoutText}>
          Log out
        </Text>
      </View>

      <View style={styles.profileHeader}>
        <Image
          style={styles.avatar}
          source={{
            uri: "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png",
          }}
        />
        <Text style={styles.name}>{fullName || "Loading..."}</Text>
        <Text style={styles.email}>{email || "Loading..."}</Text>
      </View>

      <View style={styles.menuItems}>
        {/* <Link href="/(admin)/archive" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Archive Products</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link>
        <Link href="/employees" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Manage Employees</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link>
        <Link href="/(admin)/places" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Manage Location</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link>
        <Link href="/(user)/category" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Employee View</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link> */}
        <Link href="/(user)/cashcount" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>End of Day/Bazaar</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link>
        {role && role[0] === 1 && (
          <Link href="/(admin)/category" asChild>
            <Pressable style={styles.menuButton}>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>Admin View</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </Pressable>
          </Link>
        )}
        {/* <Link href="/(user)/return" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Return Products</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  profileHeader: {
    alignItems: "center",
    paddingBottom: "40%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 18,
    color: "gray",
  },
  menuItems: {
    width: "100%",
    alignItems: "center",
  },
  menuButton: {
    backgroundColor: "lightgray",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
  },
  topButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  logoutButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  menuTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    paddingLeft: 10,
  },
});
