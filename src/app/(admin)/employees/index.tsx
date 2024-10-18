import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { useEmployeeContext } from "@/providers/EmployeeProvider"; // Ensure you have the correct import for EmployeeContext
import { supabase } from "@/src/lib/supabase";

// Define the Employee type
interface Employee {
  id: string;
  full_name: string;
  email?: string; // Optional if not always present
}

export default function EmployeeList() {
  const { employees, refreshEmployees } = useEmployeeContext();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const handleDeleteEmployee = async () => {
    if (selectedEmployee) {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", selectedEmployee.id);

      if (error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Success", "Employee deleted successfully");
        refreshEmployees();
        setModalVisible(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee List</Text>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSelectEmployee(item)}>
            <View style={styles.employeeItem}>
              <Text style={styles.employeeName}>{item.full_name}</Text>
              {item.email && (
                <Text style={styles.employeeEmail}>{item.email}</Text>
              )}
            </View>
          </Pressable>
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
  createButton: {
    marginTop: 20,
    padding: 10,
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
