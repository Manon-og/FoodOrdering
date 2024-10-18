import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useEmployeeContext } from "@/providers/EmployeeProvider";

export default function EditEmployee() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshEmployees } = useEmployeeContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email, group")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        setFullName(data.full_name);
        setEmail(data.email);
        setGroup(data.group);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleUpdateEmployee = async () => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, email, group })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Employee updated successfully");
      refreshEmployees();
      router.replace("/employees");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Employee</Text>
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
        value={group}
        onChangeText={setGroup}
        placeholder="Group"
        style={styles.input}
      />
      <Pressable style={styles.updateButton} onPress={handleUpdateEmployee}>
        <Text style={styles.updateButtonText}>Update</Text>
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
  updateButton: {
    padding: 15,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
