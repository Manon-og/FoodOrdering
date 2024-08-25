import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import Button from '@/src/components/Button';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { DefaultPhoto } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products';


const CreateProductScreen = () => {
    const [name, setNames] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState <string | null >(null);

    const { id : idString } = useLocalSearchParams(); 
    const id = parseFloat(typeof idString === 'string'? idString : idString?.[0]);
    const isUpdating = !!idString;

    const { mutate: insertProduct } = useInsertProduct();
    const { mutate: updateProduct } = useUpdateProduct();
    const { mutate: deleteProduct } = useDeleteProduct();
    const {data: updatingProduct} = useProduct(id);

    const router = useRouter();

    useEffect(() => {
        if (updatingProduct) {
            setNames(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
        }
    }, [updatingProduct]);

    const validate = () => {
        setError('');
        if (!name || !price) {
            setError('Please fill all fields');
            return false;
        }
        if (isNaN(parseFloat(price))) {
            setError('Price must be a number');
            return false;
        }
        setError('');
        return true;
    }

    const resetFields = () => {
        setNames('');
        setPrice('');
    }

    const onSubmit = () => {
        if (isUpdating) {
            onUpdate();
        } else {
            onCreate();
        }
    }

    const onCreate = () => {
        if (!validate()) {
            return;
        }
        insertProduct({ name, price: parseFloat(price), image},
       {onSuccess: () => {
            resetFields();
            router.back();
        },
       }
    );
    }

    const onUpdate = () => {
        if (!validate()) {
            return;
        }
        updateProduct({ id, name, price: parseFloat(price), image},
        {
            onSuccess: () => {
            resetFields();
            router.back();
        },
       }
     );
    }

    const onDelete = () => {
        deleteProduct(id, {
            onSuccess: () => {
            resetFields();
            router.replace('/(admin)');
         },
        }); 
      }

    const confirmDelete = () => {
        Alert.alert('Confirm', 'Are you sure you want to delete this product?',
        [
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
           }
        

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
    <View style = {styles.container}>
      <Stack.Screen options={{title: isUpdating? 'Update Product' : 'Create Product'}}/>

      <Image source={{uri: image || DefaultPhoto}} style = {styles.image}/>
      <Text onPress={pickImage} style = {styles.textButton}> Select Image </Text>

      <Text style = {styles.label}> name </Text>
      <TextInput 
      value = {name}
      onChangeText = {setNames} 
      placeholder='name' 
      style = {styles.input}
      />

      <Text style = {styles.label}> price </Text>
      <TextInput 
      value = {price}
      onChangeText = {setPrice}
      placeholder='99.9' 
      style = {styles.input}
      keyboardType='numeric'
      />

     {error ? <Text style = {{color: 'red'}}>{error}</Text> : null}
      <Button onPress={onSubmit} text = {isUpdating? 'Update' : 'Create'}/>
    {isUpdating? <Text onPress={confirmDelete} style = {styles.textButton} > Delete </Text> : null}

    </View>
  )
}

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
    }
    
    });

export default CreateProductScreen;