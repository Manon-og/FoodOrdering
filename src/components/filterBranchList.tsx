// // src/components/FilteredBranchList.tsx
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { useFilteredBranchData } from "@/src/api/products"; // Adjust the import path as needed

// const FilteredBranchList = () => {
//   const { data, error, isLoading } = useFilteredBranchData();

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: {error.message}</Text>
//       </View>
//     );
//   }

//   const renderItem = ({ item }: any) => (
//     <View style={styles.itemContainer}>
//       <Text style={styles.placeText}>{item.place}</Text>
//       <TouchableOpacity>
//         <Text style={styles.detailsText}>Details</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id.toString()}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   itemContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   placeText: {
//     fontSize: 18,
//     color: "#333",
//   },
//   detailsText: {
//     fontSize: 18,
//     color: "#007AFF",
//   },
// });

// export default FilteredBranchList;
