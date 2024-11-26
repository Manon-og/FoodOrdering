import { StyleSheet, Image, Pressable } from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { Product } from "@/src/types";
import { Link, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { useArchivedParams } from "./archivedParams";
import { useBranchName } from "./branchParams";

type ProductListItemProps = {
  title: string;
  body: string;
  time: string;
};

const AdminViewNotification = ({ title, body, time }: ProductListItemProps) => {
  const [notificationTime, setNotificationTime] = useState("");

  const getCurrentTime = () => {
    const now = new Date();
    const isoString = now.toISOString();
    const timeString = isoString.split("T")[1];
    return `T${timeString}`;
  };

  const calculateTimeDifference = (time: string) => {
    const currentTime = new Date();
    const givenTime = new Date(time);
    const difference = currentTime.getTime() - givenTime.getTime();

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours !== 0 ? hours : ""}${
      hours !== 0 ? "h" : ""
    } ${minutes}m  ago`;
  };

  useEffect(() => {
    const currentTime = getCurrentTime();
    const timeDifference = calculateTimeDifference(time);
    setNotificationTime(timeDifference);
  }, [time]);

  const content = (
    <Pressable style={styles.container}>
      <View style={styles.insideContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <Text style={styles.time}>{notificationTime}</Text>
        </View>
      </View>
    </Pressable>
  );

  return content;
};

export default AdminViewNotification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    width: "100%",
    borderRadius: 7,
  },
  insideContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 7,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  body: {
    fontSize: 13,
    color: "gray",
    fontWeight: "bold",
    flex: 1,
    paddingBottom: "4%",
  },
  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    flex: 1,

    paddingTop: "5%",
  },
});
