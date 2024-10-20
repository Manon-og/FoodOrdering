import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEmployeeContext } from "@/providers/EmployeeProvider";
import { fetchEmployees, handleCreateEmployee, handleUpdateEmployee } from "@/api/products";

const EmployeeForm = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshEmployees } = useEmployeeContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchEmployees(id).then((employees) => {
        const employee = employees.find(emp => emp.id === id);
        if (employee) {
          setFullName(employee.full_name);
          setEmail(employee.email);
          setPassword(''); 
          setIsUpdating(true);
        } else {
          console.error('Employee not found');
        }
      }).catch((error) => {
        console.error('Error fetching employee details:', error);
      });
    }
  }, [id]);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fullName || !email || (!isUpdating && !password)) {
      Alert.alert('Error', 'Please fill all fields');
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    if (isUpdating) {
    handleUpdateEmployee(id, fullName, email, password, refreshEmployees, router);
    } else {
    handleCreateEmployee(fullName, email, password, refreshEmployees, router);
    }
  };

  const handleCancel = () => {
    if (fullName || email || (!isUpdating && password)) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard your changes?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            onPress: () => router.push('/employees'),
            style: 'destructive',
          },
        ]
      );
    } else {
      router.push('/employees'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isUpdating ? 'Update Employee' : 'Create Employee'}</Text>
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
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{isUpdating ? 'Update' : 'Create'}</Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  submitButton: {
    padding: 15,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EmployeeForm;
