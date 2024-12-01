import React, { memo, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
  Pressable,
} from "react-native";
import {
  handleLogout,
  useBranchAllProductList,
  useGetCashCount,
  useGetVoidedTransaction,
  useGroupedSalesReport,
  useGroupedSalesTransaction,
  useInsertComment,
} from "@/src/api/products";

import GroupedSalesTransactionItem from "@/components/StaffGroupedSalesTransactionItem";
import { useBranchName } from "@/components/branchParams";
import { useBranchStore } from "@/src/store/branch";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useLogoutStore } from "@/store/logout";
import { CreatedByStore } from "@/store/createdby";

const Index = () => {
  const [comment, setComment] = useState("");
  const [seen, notseen] = useState(true);
  const currentDate = new Date().toLocaleDateString();
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  const router = useRouter();
  const currentComment = useInsertComment();
  const { id_branch, branchName } = useBranchStore();
  const handleSaveComment = () => {
    {
      seen
        ? Alert.alert("Comment Saved", comment)
        : Alert.alert("Submission Failed", "Comment already submitted");
    }

    {
      seen
        ? currentComment.mutate({
            id_branch: id_branch?.toString() ?? "",
            comment,
          })
        : null;
    }
    notseen(false);
  };

  const { data: products } = useBranchAllProductList(
    id_branch?.toString() ?? ""
  );
  const totalQuantity = products?.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  const date2 = new Date().toISOString().split("T")[0];
  const { data: cashcount } = useGetCashCount(
    id_branch ? id_branch.toString() : "",
    date2.toString()
  );
  const TOTALCASHCOUNT = cashcount?.map((item: any) => item.total);

  const date = new Date();
  const { data: salesReport }: any = useGroupedSalesReport(
    id_branch?.toString() ?? "",
    date
  );
  const totalSales =
    salesReport?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  const { created_by } = CreatedByStore();

  const { data: voidData }: any = useGetVoidedTransaction(
    id_branch?.toString() ?? "",
    date
  );
  const totalVoidedSales =
    voidData?.reduce(
      (acc: any, item: { amount_by_product: any }) =>
        acc + item.amount_by_product,
      0
    ) || 0;

  // const created_by = salesReport?.map((item: any) => item.created_by);
  console.log("created_by", created_by);
  console.log("salesReport", salesReport);
  const setStatus = useLogoutStore((state) => state.setStatus);

  const navigateToProfile = () => {
    setStatus("done");
    router.push("/(user)/profile");
  };

  // useEffect(() => {
  //   setStatus("done");
  // }, ["done"]);

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <View style={styles.headerContainer}>
          <Text style={styles.dayText}>{currentDay}</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
        <View style={styles.paddingTop}>
          <View style={styles.row}>
            <Text style={styles.label}>Created By:</Text>
            <Text style={styles.value}>{created_by}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Sales:</Text>
            <Text style={styles.value}>₱ {totalSales.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Voided Sales:</Text>
            <Text style={styles.value}>₱ {totalVoidedSales}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Cash Count:</Text>
            <Text style={styles.value}>₱ {TOTALCASHCOUNT}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Returned Product Quantity:</Text>
            <Text style={styles.value}>{totalQuantity}pcs.</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Comments:</Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Enter your comment"
          multiline
          numberOfLines={4}
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleSaveComment}>
            <Text style={styles.buttonText}>Save Comment</Text>
          </Pressable>
        </View>

        <View style={styles.logout}>
          <Button onPress={navigateToProfile} text={"Confirm"} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paddingTop: {
    paddingTop: "10%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  frame: {
    width: "90%",
    height: "80%",
    borderWidth: 2,
    borderColor: "#0E1432",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
  dayText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0E1432",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#393939",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#393939",
    flex: 1,
    textAlign: "right",
  },
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    // marginTop: 10,
    textAlignVertical: "top",
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  button: {
    backgroundColor: "gray",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  logout: {
    marginTop: "auto",
  },
});

export default Index;
