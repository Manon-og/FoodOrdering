import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import Button from "@/src/components/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEmployeeContext } from "@/providers/EmployeeProvider";
import {
  useArchiveEmployee,
  useUnarchiveEmployee,
  getLastSignInTime,
} from "@/api/products"; // Ensure the correct import path
import { EmployeeProvider } from "@/providers/EmployeeProvider";
import Colors from "../../../constants/Colors";

const EmployeeDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { employees, refreshEmployees } = useEmployeeContext();

  interface Employee {
    id: string;
    full_name: string;
    email: string;
    id_roles: number;
    birth_date: any;
    id_archives: number;
  }

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [lastSignInTime, setLastSignInTime] = useState<string | null>(null);
  const { mutate: archiveEmployee } = useArchiveEmployee();
  const { mutate: unarchiveEmployee } = useUnarchiveEmployee();

  useEffect(() => {
    if (id) {
      const emp = employees.find((emp) => emp.id === id);
      if (emp) {
        setEmployee(emp);
        fetchLastSignInTime(emp.id);
      } else {
        refreshEmployees()
          .then(() => {
            const emp = employees.find((emp) => emp.id === id);
            setEmployee(emp);
            if (emp) {
              fetchLastSignInTime(emp.id);
            }
          })
          .catch((error) => {
            console.error("Error fetching employee details:", error);
          });
      }
    }
  }, [id, employees, refreshEmployees]);

  const fetchLastSignInTime = async (userId: string) => {
    try {
      const lastSignIn = await getLastSignInTime(userId);
      console.log("Last sign-in time:", lastSignIn); // Log the last sign-in time for checking
      setLastSignInTime(lastSignIn);
    } catch (error) {
      console.error("Error fetching last sign-in time:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/employees/edit?id=${id}`);
  };

  const handleArchive = () => {
    Alert.alert(
      "Archive Employee",
      "Are you sure you want to archive this employee?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Archive",
          onPress: async () => {
            try {
              await archiveEmployee(id);
              refreshEmployees();
              router.push("/employees");
              Alert.alert("Success", "Employee archived successfully");
            } catch (error) {
              console.error("Error archiving employee:", error);
              Alert.alert("Error", "Failed to archive employee");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleUnarchive = () => {
    Alert.alert(
      "Unarchive Employee",
      "Are you sure you want to unarchive this employee?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unarchive",
          onPress: async () => {
            try {
              await unarchiveEmployee(id);
              refreshEmployees();
              router.push("/employees");
              Alert.alert("Success", "Employee unarchived successfully");
            } catch (error) {
              console.error("Error unarchiving employee:", error);
              Alert.alert("Error", "Failed to unarchive employee");
            }
          },
          style: "default",
        },
      ]
    );
  };

  const getRoleName = (id_roles: number) => {
    switch (id_roles) {
      case 1:
        return "Admin";
      case 2:
        return "Staff";
      default:
        return "Unknown";
    }
  };

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Details</Text>
      <Text style={styles.label}>Full Name:</Text>
      <Text style={styles.value}>{employee.full_name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{employee.email}</Text>
      <Text style={styles.label}>Birth date:</Text>
      <Text style={styles.value}>{employee.birth_date}</Text>
      <Text style={styles.label}>Group:</Text>
      <Text style={styles.role}>{getRoleName(employee.id_roles)}</Text>
      {lastSignInTime && (
        <Text style={styles.lastSignIn}>
          Last Sign-In: {new Date(lastSignInTime).toLocaleString()}
        </Text>
      )}
      {/* <Pressable style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable> */}
      <Button onPress={handleEdit} text={"Edit"} />
      <Button
        text={employee.id_archives === 1 ? "Unarchive" : "Archive"}
        onPress={employee.id_archives === 1 ? handleUnarchive : handleArchive}
      />
    </View>
  );
};

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
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  lastSignIn: {
    fontSize: 16,
    color: "green",
    marginBottom: 20,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    color: Colors.light.tint,
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  role: {
    fontSize: 18,
    color: "blue",
    marginBottom: 20,
  },
});

export default EmployeeDetail;
