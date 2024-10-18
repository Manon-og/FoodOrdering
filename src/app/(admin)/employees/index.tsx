import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Link } from "expo-router";
import { useEmployeeContext } from "@/providers/EmployeeProvider";

export default function EmployeeList() {
  const { employees } = useEmployeeContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee List</Text>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <Text style={styles.employeeName}>{item.full_name}</Text>
            {item.email && (
              <Text style={styles.employeeEmail}>{item.email}</Text>
            )}
            {item.group && (
              <Text style={styles.employeeGroup}>{item.group}</Text>
            )}
          </View>
        )}
      />
      <Link href="/employees/create" asChild>
        <Pressable style={styles.createButton}>
          <Text style={styles.createButtonText}>Create Employee</Text>
        </Pressable>
      </Link>
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
    paddingTop: 20,
  },
  employeeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  employeeEmail: {
    fontSize: 16,
    color: "gray",
  },
  employeeGroup: {
    fontSize: 16,
    color: "blue",
  },
  createButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
