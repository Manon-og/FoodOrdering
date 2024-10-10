import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAvailableBatch } from '@/src/api/products'; 

type AvailableBatchProps = {
  productId: string;
};

const AvailableBatch = ({ productId }: AvailableBatchProps) => {
  const { data: batches, error, isLoading } = useAvailableBatch(productId);

  if (isLoading) {
    return <Text>{batches}Loading... {batches}</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;

  }

  const availableBatch = batches?.find(batch => batch.id_branch === null);

  return (
    <View style={styles.container}>
      {availableBatch ? (
        <Text style={styles.batchText}>Batch: {availableBatch.batch}</Text>
      ) : (
        <Text style={styles.batchText}>No available batch</Text>
      )}
    </View>
  );
};

export default AvailableBatch;

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
  },
  batchText: {
    fontSize: 14,
    color: 'gray',
  },
});