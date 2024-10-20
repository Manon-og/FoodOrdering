import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useEmployeeContext } from '@/providers/EmployeeProvider';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';

export default function EmployeeList() {
  const { employees } = useEmployeeContext();
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/employees/detail?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleViewDetails(item.id)}>
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
            </View>
          </Pressable>
        )}
      />
      <Link href="/employees/create" asChild>
        <Pressable style={styles.createButton}>
          <Text style={styles.createButtonText}>Add new Employee</Text>
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