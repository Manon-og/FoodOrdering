// import { FlatList, SafeAreaView, StyleSheet } from "react-native";

// import EditScreenInfo from "@/src/components/EditScreenInfo";
// import { Text, View } from "@/src/components/Themed";
// import {
//   useGroupedSalesTransaction,
//   useSalesTransaction,
// } from "@/api/products";
// import SalesTransaction from "@/src/components/SalesTransaction";
// import GroupedSalesTransactionItem from "@/components/StaffGroupedSalesTransactionItem";
// import { memo } from "react";

// export default function TabTwoScreen() {
//   const { data: sales } = useSalesTransaction();
//   // const id_group = sales?.[0]?.id_group;
//   // const amount = sales?.[0]?.amount;

//   let id_salestransaction = 1;
//   // let currentIdGroup = 1;

//   const MemoizedProductListItem = memo(GroupedSalesTransactionItem);

//   // if (id_group.lenght() > 1) {
//   //   id_salestransaction++;
//   // }

//   // console.log("ID_GROUP", id_group);
//   // console.log("AMOUNT", amount);
//   const { data: groupedSales, error, isLoading } = useGroupedSalesTransaction();

//   console.log("SALES TRANSACTION", groupedSales);

//   console.log("SALES", sales);

//   // const renderItem = ({ item }: { item: any }) => (
//   //   <GroupedSalesTransactionItem
//   //     id_group={item.id_group}
//   //     amount={item.amount}
//   //     created_at={item.created_at}
//   //     transactions={item.transactions}
//   //   />
//   // );

//   let currentIdGroup = 1;
//   // console.log("ID_GROUP>>?", groupedSales);
//   // const displayIdGroup = currentIdGroup;
//   // if (groupedSales?.length > 1) {
//   //   currentIdGroup++;
//   // }

//   // console.log("ID_GROUP", displayIdGroup);

//   const renderItem = ({ item }: { item: any }) => {
//     const displayIdGroup = currentIdGroup;
//     currentIdGroup++;
//     return (
//       <GroupedSalesTransactionItem
//         id_group={displayIdGroup.toString()}
//         amount={item.amount}
//         created_at={item.created_at}
//         transactions={item.transactions}
//       />
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={groupedSales}
//         keyExtractor={(item) => item.id_group}
//         renderItem={renderItem}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: "80%",
//   },
// });
