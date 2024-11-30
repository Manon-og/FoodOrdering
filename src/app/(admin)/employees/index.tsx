import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import { useEmployeeContext } from "@/providers/EmployeeProvider";
import { useRouter } from "expo-router";

const data = [
  { label: "All", value: null },
  { label: "Admin", value: 1 },
  { label: "Staff", value: 2 },
  { label: "Archived", value: "archived" },
];

export default function EmployeeList() {
  const { employees } = useEmployeeContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleViewDetails = (id: string) => {
    router.push(`/(admin)/employees/employeeDetail?id=${id}`);
  };

  const filteredEmployees = employees
    .filter((employee) => {
      const matchesSearch = employee.full_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesRole =
        roleFilter === "archived"
          ? employee.id_archives === 1
          : roleFilter !== null
          ? employee.id_roles === roleFilter
          : true;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => a.id_archives - b.id_archives); // Added sort to place archived employees at the bottom

  const getEmployeeStyle = (employee: { id_archives: number }) => {
    return employee.id_archives === 1
      ? styles.archivedEmployee
      : styles.employee;
  };

  return (
    <View style={styles.backgroundColor}>
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Employees"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Filter Role" : "..."}
            searchPlaceholder="Search roles..."
            value={roleFilter}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setRoleFilter(item.value);
              setIsFocus(false);
            }}
          />
        </View>

        <FlatList
          data={filteredEmployees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={getEmployeeStyle(item)}
              onPress={() => handleViewDetails(item.id)}
            >
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
      </View>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  archivedEmployee: {
    padding: 2,
    backgroundColor: "#d3d3d3",
    borderRadius: 5,
    marginBottom: 10,
  },
  employee: {
    padding: 2,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    paddingLeft: 10,
    borderRadius: 5,
  },
  dropdown: {
    height: 40,
    width: 120,
    marginLeft: 10,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
  backgroundColor: {
    backgroundColor: "white",
    flex: 1,
  },
});
