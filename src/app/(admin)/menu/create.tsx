import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Button from '@/src/components/Button';
import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Image } from 'react-native';
import { DefaultPhoto } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products';
import {useCategory} from '@/src/components/categoryWTF';

 // Adjust the import based on your project structure

const CreateProductScreen = () => {
  const [name, setNames] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);

  const category = +useCategory();

  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct(category);
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct(id);
  const { data: updatingProduct } = useProduct(id);

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setNames(updatingProduct.name);
      setPrice(updatingProduct.id_price.amount.toString());
      setDescription(updatingProduct.description || '');
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const validate = () => {
    setError('');
    if (!name || !price || !description) {
      setError('Please fill all fields');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setError('Price must be a number');
      return false;
    }
    setError('');
    return true;
  };

  const resetFields = () => {
    setNames('');
    setPrice('');
    setDescription('');
  };

  const onSubmit = () => {
    console.log('onSubmit called');
    if (isUpdating) {
      console.log('onUpdate called');
      onUpdate();
    } else {
      onCreate();
    }
  };

  // const onCreate = () => {
  //   if (!validate()) {
  //     return;
  //   }
  //   insertProduct(
  //     { name, description, image, amount: parseFloat(price) },
  //     {
  //       onSuccess: () => {
  //         console.log('Product inserted successfully');
  //         resetFields();
  //         router.back();
  //       },
  //       onError: (error) => {
  //         console.error('Insert Product Error:', error);
  //       },
  //     }
  //   );
  // };

  const onCreate = () => {
    if (!validate()) {
      return;
    }
    insertProduct(
      { name, description, image, id_price: { amount: parseFloat(price) }},
      {
        onSuccess: () => {
          console.log('Product inserted successfully');
          resetFields();
          router.back();
        },
        onError: (error) => {
          console.error('Insert Product Error:', error);
        },
      }
    );
  };

  const onUpdate = () => {
    if (!validate()) {
      console.log('Validation failed');
      return;
    }
    console.log('Updating product');
    updateProduct(
      { id, name, id_price: { amount: parseFloat(price) }, description, image },
      {
        onSuccess: () => {
          console.log('Product updated successfully');
          resetFields();
          router.back();
        },
        onError: (error) => {
          console.error('Update Product Error:', error);
        },
      }
    );
  };

  const onDelete = () => {
    console.log('Deleting product');
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: onDelete,
        style: 'destructive',
      },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />

      <Image source={{ uri: image || DefaultPhoto }} style={styles.image} />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setNames} placeholder="Name" style={styles.input} />

      <Text style={styles.label}>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="99.9"
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        style={styles.input}
      />

      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'} />
      {isUpdating ? (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: 'gray',
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    color: Colors.light.tint,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default CreateProductScreen;