import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { Link, useRouter } from "expo-router"; // Import Link and useRouter components
import { handleLogout, getUserEmail, getUserFullName } from "@/api/products"; // Import handleLogout and getUserEmail functions

export default function UserProfile() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = await getUserEmail();
      setEmail(userEmail);

      const userFullName = await getUserFullName();
      setFullName(userFullName);
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topButton}>
        <Pressable
          style={styles.logoutButton}
          onPress={() => handleLogout(router)}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
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
        <Link href="/(admin)/archive" asChild>
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
        </Link>
        <Link href="/(user)/return" asChild>
          <Pressable style={styles.menuButton}>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Return Products</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        </Link>
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
    color: "white",
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
