import React from "react";
import { View, Dimensions, StyleSheet, ScrollView } from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";

const App = () => {
  // Dummy data for the line chart with two lines
  const lineChartData = {
    labels: ["Jan", "Feb"],
    datasets: [
      {
        data: [20, 45],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: [30, 50],
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
  };

  // Dummy data for the bar chart with two bars for each month
  const barChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      },
      // {
      //   data: [30, 50, 40, 95, 85, 55],
      //   color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`, // optional
      // },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <LineChart
          style={styles.chart}
          data={lineChartData}
          width={Dimensions.get("window").width - 16} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#0E1432",
            backgroundGradientFrom: "#0E1432",
            backgroundGradientTo: "#0E1432",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          verticalLabelRotation={30}
        />
      </View>
      <View style={styles.chartContainer}>
        <BarChart
          style={styles.chart}
          data={barChartData}
          width={Dimensions.get("window").width - 16} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#0E1432",
            backgroundGradientFrom: "#0E1432",
            backgroundGradientTo: "#0E1432",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // solid background lines with no dashes
            },
          }}
          verticalLabelRotation={30}
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
    marginVertical: 8,
    alignItems: "center",
  },
  chart: {
    borderRadius: 16,
  },
});

export default App;
