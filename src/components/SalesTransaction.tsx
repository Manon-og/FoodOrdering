import { StyleSheet } from "react-native";
import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, View } from "@/src/components/Themed";

interface TabTwoScreenProps {
  sales: Array<{
    amount: number;
    created_at: string;
    created_by: string;
    id_branch: number;
    // id_localbranch: number;
    id_products: number;
    id_salestransaction: number;
    quantity: number;
  }>;
}

export default function TabTwoScreen({ sales }: TabTwoScreenProps) {
  console.log("SALES", sales);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
      {sales?.map((sale) => (
        <View key={sale.id_salestransaction} style={styles.itemContainer}>
          <Text style={styles.itemText}>Amount: {sale.amount}</Text>
          <Text style={styles.itemText}>Created At: {sale.created_at}</Text>
          <Text style={styles.itemText}>Created By: {sale.created_by}</Text>
          <Text style={styles.itemText}>Branch ID: {sale.id_branch}</Text>
          {/* <Text style={styles.itemText}>
            Local Branch ID: {sale.id_localbranch}
          </Text> */}
          <Text style={styles.itemText}>Product ID: {sale.id_products}</Text>
          <Text style={styles.itemText}>
            Sales Transaction ID: {sale.id_salestransaction}
          </Text>
          <Text style={styles.itemText}>Quantity: {sale.quantity}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});
