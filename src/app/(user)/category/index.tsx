import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={() => router.push('/(user)/menu?category=1')}>
        <Text style={styles.pressableText}>COOKIE</Text>
      </Pressable>
      <Pressable style={styles.pressable} onPress={() => router.push('/(user)/menu?category=2')}>
        <Text style={styles.pressableText}>BREADS</Text>
      </Pressable>
      <Pressable style={styles.pressable} onPress={() => router.push('/(user)/menu?category=3')}>
        <Text style={styles.pressableText}>CAKES</Text>
      </Pressable>
      <Pressable style={styles.pressable} onPress={() => router.push('/(user)/menu?category=4')}>
        <Text style={styles.pressableText}>BENTO CAKES</Text>
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
    marginTop:' 50%',
    flexDirection: 'row',
    flexWrap: 'wrap',

  },
  pressable: {
    width: '40%', 
    height: 100,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10, 
    borderRadius: 15,
  },
  pressableText: {
    color: 'black',
    fontStyle: 'italic',
  },
});