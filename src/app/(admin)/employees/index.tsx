import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useEmployeeContext } from '@/providers/EmployeeProvider';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';

export default function EmployeeList() {
  const { employees } = useEmployeeContext();
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/employees/edit?id=${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete employee with id: ${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="angle-left" size={35} color={Colors.light.tint} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Employee List</Text>
      </View>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <View style={styles.employeeInfo}>
              <Text style={styles.employeeName}>{item.full_name}</Text>
              {item.email && (
                <Text style={styles.employeeEmail}>{item.email}</Text>
              )}
              {item.group && (
                <Text style={styles.employeeGroup}>{item.group}</Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.editButton]}
                onPress={() => handleEdit(item.id)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
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
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.light.tint,
    fontSize: 18,
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  employeeEmail: {
    fontSize: 16,
    color: 'gray',
  },
  employeeGroup: {
    fontSize: 16,
    color: 'blue',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});