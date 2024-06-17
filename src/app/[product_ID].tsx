import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

const ProductDetailsScreen = () => {
    const { product_ID } = useLocalSearchParams();
    return (
        <View>
            <Text>{product_ID}</Text>
        </View>
    );
};

export default ProductDetailsScreen;