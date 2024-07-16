import { useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

const ProductDetailsScreen = () => {
    const { product_ID } = useLocalSearchParams();
    return (
        <View>
            <Stack.Screen options={{title:"Details:" + product_ID}} />
            <Text>{product_ID}</Text>
        </View>
    );
};

export default ProductDetailsScreen;