import { useLocalSearchParams } from 'expo-router';

export const useCategory = () => {
  const { category: idCategory } = useLocalSearchParams();
  return idCategory ? idCategory.toString() : '';
};

