import { useLocalSearchParams } from 'expo-router';

export const useArchivedParams = () => {
    const { id_archive} = useLocalSearchParams<{ id_archive?: string}>();
    return {
        id_archive: id_archive ? id_archive.toString() : ''
    };
};