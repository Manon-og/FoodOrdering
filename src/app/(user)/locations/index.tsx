import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link } from 'expo-router';
import { useBranch } from '@/src/api/products';
import { useByBranch } from '@/src/providers/BranchProvider';
import { useBranchName } from '@/src/components/branchParams';

const Index = () => {
  const { data: branch } = useBranch();
  console.log('branch:', branch);
  const place = branch?.map(item => item.id_branch);
  console.log('place:', place);

  const { id_branch, branchName } = useBranchName();
  console.log('IDIDID:', id_branch);
  console.log('IDIDID:', branchName);
  const { setBranchName, setIdBranch } = useByBranch();

 
  for (const pla of place ?? []) {
    console.log('place:', pla);
    console.log('id_branch:', {id_branch});
    if (pla.toString() === id_branch.toString()) {
      console.log('QQ:', id_branch);
      console.log('QQ:', branchName);
    }
  }


  useEffect(() => {
    setBranchName(branchName);
    setIdBranch(id_branch);
  }, [branchName, id_branch, setBranchName, setIdBranch]);

  console.log('id_branchs???', id_branch);
  console.log('branchNames???', branchName);

  const [id, setID] = useState(id_branch);
  const [idName, setIDName] = useState(branchName);

  useEffect(() => {
    setID(id_branch);
  }, [id_branch]);

  console.log('AAA:', id_branch);
  console.log('EEE:', id); 


  const fi = id_branch? id_branch  :  id;


  console.log('HERE:', id_branch);
  console.log('here:', branchName);

  return (
    <View>
      <View style={styles.container}>
        <Link href={`/(user)/menu?category=1&id_branch=${id_branch}&branchName=${branchName}`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>COOKIE</Text>
          </Pressable>
        </Link>
        <Link href={`/(user)/menu?category=2&id_branch=${id_branch}&branchName=${branchName}`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link href={`/(user)/menu?category=3&id_branch=${id_branch}&branchName=${branchName}`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link href={`/(user)/menu?category=4&id_branch=${id_branch}&branchName=${branchName}`} asChild>
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
    marginTop: '54%',
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
  location: {
    margin: 10,
    marginLeft: '30%',
    width: '40%',
  },
});