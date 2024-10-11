import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import { Button } from 'react-native-elements';
import { useBranch } from '@/src/api/products';
import BranchOptionsModal from '@/src/modals/branchModals';

const Index = () => {
  const router = useRouter();
  const { data: branch } = useBranch();
  console.log('branchs:', branch); 
  const place = branch?.map(item => item.place);
  console.log('place:', place);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(null);

  const onSelectBranch = (id_branch: string, branchName: string) => {
    console.log('Selected branch ID:', id_branch, branchName);
    setSelectedBranchName(branchName);
    router.push({
      pathname: '/(user)/locations',
      params: { id_branch, branchName },
    });
  };

  return (
    <View>
      <Button
        style={styles.location}
        title="EDIT LOCATIONS"
        onPress={() => setModalVisible(true)}
      />
    
      <BranchOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        branches={branch || []}
        onSelectBranch={onSelectBranch}
        branchName={selectedBranchName}
      />
      <View style={styles.container}>
        <Link href={`/(admin)/menu?category=1`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>COOKIE</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=2`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>BREADS</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=3`} asChild>
          <Pressable style={styles.pressable}>
            <Text style={styles.pressableText}>CAKES</Text>
          </Pressable>
        </Link>
        <Link href={`/(admin)/menu?category=4`} asChild>
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
    marginTop: '30%',
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

  profileHeader: {
    alignItems: 'center',
    paddingBottom: '40%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
  },
  menuItems: {
    width: '80%',
    marginLeft: '10%',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginTop: 10,
  },
  menuTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    paddingLeft: 10,
  },
});