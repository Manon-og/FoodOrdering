import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link,  } from 'expo-router';

const Index = () => {
  return (
    <View>
      <View style={styles.container}>
        <Link href={`/(admin)/menu?category=1&id_archive=1`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>COOKIE</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=2&id_archive=1`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=3&id_archive=1`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=4&id_archive=1`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>BENTO CAKES</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: '50%',
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