import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEmployeeContext } from '@/providers/EmployeeProvider';
import { deleteEmployee } from '@/api/products'; // Ensure the correct import path
import { EmployeeProvider } from '@/providers/EmployeeProvider';    
import Colors from '../../../constants/Colors';

const EmployeeDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { employees, refreshEmployees } = useEmployeeContext();
  
  interface Employee {
    id: string;
    full_name: string;
    email: string;
    group: string;
  }

  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      const emp = employees.find(emp => emp.id === id);
      if (emp) {
        setEmployee(emp);
      } else {
        refreshEmployees().then(() => {
          const emp = employees.find(emp => emp.id === id);
          setEmployee(emp);
        }).catch((error) => {
          console.error('Error fetching employee details:', error);
        });
      }
    }
  }, [id, employees, refreshEmployees]);

  const handleEdit = () => {
    router.push(`/employees/edit?id=${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteEmployee(id).then(() => {
              router.push('/employees');
              Alert.alert('Success', 'Employee deleted successfully');
            }).catch((error) => {
              console.error('Error deleting employee:', error);
              Alert.alert('Error', 'Failed to delete employee');
            });
          },
          style: 'destructive',
        },
      ]
    );
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
      <Text style={styles.label}>Group:</Text>
      <Text style={styles.value}>{employee.group}</Text>
      <Pressable style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.buttonText}>Edit</Text>
      </Pressable>
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete</Text>
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    padding: 15,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EmployeeDetail;