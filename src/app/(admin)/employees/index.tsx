import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useEmployeeContext } from "@/providers/EmployeeProvider";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import Button from "@/src/components/Button";

export default function EmployeeList() {
  const { employees } = useEmployeeContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (id: string) => {
    router.push(`/(admin)/employees/employeeDetail?id=${id}`);
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

  const filteredEmployees = employees.filter((employee) =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Employees"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleViewDetails(item.id)}>
            <View style={styles.employeeItem}>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{item.full_name}</Text>
                {item.email && (
                  <Text style={styles.employeeEmail}>{item.email}</Text>
                )}
                <Text style={styles.employeeRole}>
                  {getRoleName(item.id_roles)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
      {/* <Link href="/employees/create" asChild>
        <Button text={"Add New Employee"} />
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  employeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  employeeEmail: {
    fontSize: 16,
    color: "gray",
  },
  employeeRole: {
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
