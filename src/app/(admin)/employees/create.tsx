import React from "react";
import { View, StyleSheet } from "react-native";
import EmployeeForm from "./EmployeeForm";

export default function CreateEmployee() {
  return (
    <View style={styles.container}>
      <EmployeeForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
});
