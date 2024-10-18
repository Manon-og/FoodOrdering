import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { supabaseAdmin } from "@/src/lib/supabase";
import { useEmployeeContext } from "@/providers/EmployeeProvider";

export default function EmployeeForm() {
  const router = useRouter();
  const { refreshEmployees } = useEmployeeContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateEmployee = async () => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      const userId = data.user?.id;
      if (userId) {
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .upsert([{ id: userId, full_name: fullName, email }]);

        if (profileError) {
          Alert.alert("Error", profileError.message);
        } else {
          Alert.alert("Success", "Employee created successfully");
          refreshEmployees(); // Refresh the employee list
          router.replace("/employees");
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Employee</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={styles.input}
        secureTextEntry
      />
      <Pressable style={styles.createButton} onPress={handleCreateEmployee}>
        <Text style={styles.createButtonText}>Create</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  createButton: {
    padding: 15,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
