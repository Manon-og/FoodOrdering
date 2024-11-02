import { SafeAreaView, StyleSheet } from "react-native";

import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Text, View } from "@/src/components/Themed";
import { useSalesTransaction } from "@/api/products";
import SalesTransaction from "@/src/components/SalesTransaction";

export default function TabTwoScreen() {
  const { data: sales } = useSalesTransaction();
  console.log("SALES", sales);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Ta? Two</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
      <SafeAreaView style={{ flex: 1 }}>
        <SalesTransaction sales={sales} />
      </SafeAreaView>
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
});
