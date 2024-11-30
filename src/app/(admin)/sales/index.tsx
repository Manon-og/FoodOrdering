import {
  useGetDataForChart,
  useGetDataForChartByLoss,
  useGetDataForChartByWeek,
  useGetDataForChartByWeekByLoss,
} from "@/api/products";
import DropdownComponentForSales from "@/components/DropDownForSales";
import DropdownComponentForSalesType from "@/components/DropDownType";
import React, { useState, useMemo, useEffect } from "react";
import { View, Dimensions, StyleSheet, ScrollView, Text } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";

const App = () => {
  const { data, isLoading, error } = useGetDataForChart();
  const {
    data: Loss,
    isLoading: LossIsLoading,
    error: LossError,
  } = useGetDataForChartByLoss();

  const {
    data: dataByWeek,
    isLoading: dataByWeekLoading,
    error: dataByWeekError,
  } = useGetDataForChartByWeek();

  const {
    data: dataByWeekLoss,
    isLoading: dataByWeekLossLoading,
    error: dataByWeekLossError,
  } = useGetDataForChartByWeekByLoss();

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("sales");

  const filter = useMemo(() => {
    const months = dataByWeek?.map((item: any) => item.month) || [];
    const uniqueMonths = Array.from(new Set(months));
    return uniqueMonths.map((month) => ({ label: month, value: month }));
  }, [dataByWeek]);

  useEffect(() => {
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    if (filter.some((item) => item.value === currentMonth)) {
      setSelectedMonth(currentMonth);
    }
  }, [filter]);

  console.log("dataByWeekLoss:", dataByWeekLoss);
  console.log("dataByWeek:", dataByWeek);
  console.log("Loss:", Loss);
  console.log("datsa:", data);

  if (
    isLoading ||
    LossIsLoading ||
    dataByWeekLoading ||
    dataByWeekLossLoading
  ) {
    return <Text>Loading...</Text>;
  }

  if (error || LossError || dataByWeekError || dataByWeekLossError) {
    return (
      <Text>
        Error:{" "}
        {error?.message ||
          LossError?.message ||
          dataByWeekError?.message ||
          dataByWeekLossError?.message}
      </Text>
    );
  }

  const lineChartLabels = data?.map((item: any) => item.month) || [];
  const lineChartDataValues = data?.map((item: any) => item.amount) || [];

  const lineChartLabelsLoss = Loss?.map((item: any) => item.month) || [];
  const lineChartDataValuesLoss =
    Loss?.map((item: any) => item.potential_sales) || [];

  const validLineChartDataValues = lineChartDataValues.filter(
    (value) => !isNaN(value) && value !== undefined
  );

  const validLineChartDataValuesLoss = lineChartDataValuesLoss.filter(
    (value) => !isNaN(value) && value !== undefined
  );

  const minLength = Math.min(
    lineChartLabels.length,
    validLineChartDataValues.length,
    validLineChartDataValuesLoss.length
  );

  const finalLineChartLabels = lineChartLabels.slice(0, minLength);
  const finalLineChartDataValues = validLineChartDataValues.slice(0, minLength);
  const finalLineChartDataValuesLoss = validLineChartDataValuesLoss.slice(
    0,
    minLength
  );

  const lineChartData = {
    labels: finalLineChartLabels,
    datasets: [
      {
        data: finalLineChartDataValues,
        color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
        strokeWidth: 4,
      },
      {
        data: finalLineChartDataValuesLoss,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 4,
      },
    ],
  };

  const filteredDataByWeek = (
    selectedType === "sales" ? dataByWeek : dataByWeekLoss
  )
    ?.filter((item: any) => item.month === selectedMonth)
    .sort((a: any, b: any) => a.week - b.week);

  const barChartLabels =
    filteredDataByWeek?.map((item: any) => `Week ${item.week}`) || [];
  const barChartDataValues =
    filteredDataByWeek?.map((item: any) =>
      selectedType === "sales" ? item.amount : item.potential_sales
    ) || [];

  const barChartData = {
    labels: barChartLabels,
    datasets: [
      {
        data: barChartDataValues,
        color: (opacity = 1) =>
          selectedType === "sales"
            ? `rgba(0, 128, 0, ${opacity})`
            : `rgba(255, 0, 0, ${opacity})`,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.headerText}>Monthly Breakdown: Sales and Loss</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            style={styles.chart}
            data={lineChartData}
            width={Dimensions.get("window").width - 32}
            height={250}
            yAxisLabel="₱"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#0E1432",
              backgroundGradientFrom: "#0E1432",
              backgroundGradientTo: "#0E1432",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
                paddingLeft: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "4",
              },
            }}
          />
        </View>
      </View>

      <Text style={styles.subHeaderText}>
        Choose Month and Type of Data to Display
      </Text>
      <View style={styles.dropdownContainer}>
        <DropdownComponentForSales data={filter} onSelect={setSelectedMonth} />
        <DropdownComponentForSalesType
          data={[
            { label: "Sales", value: "sales" },
            { label: "Loss", value: "loss" },
          ]}
          onSelect={setSelectedType}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.headerText}>Weekly Breakdown: Sales or Loss</Text>
        <BarChart
          style={styles.chart}
          data={barChartData}
          width={Dimensions.get("window").width - 32}
          height={250}
          yAxisLabel="₱"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#0E1432",
            backgroundGradientFrom: "#0E1432",
            backgroundGradientTo: "#0E1432",
            decimalPlaces: 0,
            color: (opacity = 1) =>
              selectedType === "sales"
                ? `rgba(0, 128, 0, ${opacity})`
                : `rgba(255, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              paddingLeft: 16,
            },
            propsForBackgroundLines: {
              strokeDasharray: "",
            },
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chartContainer: {
    marginVertical: 16,
    alignItems: "center",
    // padding: 16,
  },
  chartWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#0E1432",
  },
  chart: {
    borderRadius: 16,
  },
  dropdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 8,
  },
});

export default App;
