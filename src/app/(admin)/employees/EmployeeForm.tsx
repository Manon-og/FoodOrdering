import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEmployeeContext } from "@/providers/EmployeeProvider";
import {
  handleCreateEmployee,
  handleUpdateEmployee,
  fetchEmployees,
} from "@/api/products"; // Ensure the correct import path

const EmployeeForm = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshEmployees } = useEmployeeContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idRoles, setIdRoles] = useState<number>(0); // Add state for id_roles
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEmployees(id)
        .then((employees) => {
          const employee = employees.find((emp) => emp.id === id);
          if (employee) {
            setFullName(employee.full_name);
            setEmail(employee.email);
            setIdRoles(employee.id_roles); // Set id_roles
            setPassword("");
            setIsUpdating(true);
          } else {
            console.error("Employee not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching employee details:", error);
        });
    }
  }, [id]);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName || !email || (!isUpdating && !password)) {
      Alert.alert("Error", "Please fill all fields");
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (idRoles === 0) {
      Alert.alert("Error", "Please select a role (Admin or Staff)");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (isUpdating) {
      handleUpdateEmployee(
        id,
        fullName,
        email,
        idRoles,
        refreshEmployees,
        router
      );
    } else {
      handleCreateEmployee(
        fullName,
        email,
        password,
        idRoles,
        refreshEmployees,
        router
      );
    }
  };

  const handleCancel = () => {
    if (fullName || email || (!isUpdating && password)) {
      Alert.alert(
        "Discard Changes?",
        "Are you sure you want to discard your changes?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isUpdating ? "Edit Employee" : "Create Employee"}
      </Text>
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
      {!isUpdating && (
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          style={styles.input}
          secureTextEntry
        />
      )}
      <Picker
        selectedValue={idRoles}
        onValueChange={(itemValue) => setIdRoles(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Select Role" value={0} />
        <Picker.Item label="Admin" value={1} />
        <Picker.Item label="Staff" value={2} />
      </Picker>
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isUpdating ? "Update" : "Create"}
        </Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              Confirm {isUpdating ? "Update" : "Create"}
            </Text>
            <Text style={styles.modalText}>Full Name: {fullName}</Text>
            <Text style={styles.modalText}>Email: {email}</Text>
            <Text style={styles.modalText}>Role: {getRoleName(idRoles)}</Text>
            {!isUpdating && (
              <Text style={styles.modalText}>Password: {password}</Text>
            )}
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>
                  {isUpdating ? "Update" : "Create"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
  submitButton: {
    padding: 15,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 15,
    backgroundColor: "#dc3545",
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: "#dc3545",
  },
  buttonConfirm: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EmployeeForm;
