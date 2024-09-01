import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={() => router.push('/(admin)/menu/')}>
        <Text style={styles.pressableText}>COOKIE</Text>
      </Pressable>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pressable: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pressableText: {
    color: 'black',
  },
});