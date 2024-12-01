import {
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Colors from "../constants/Colors";
import { Text, View } from "@/src/components/Themed";
import { Product } from "@/src/types";
import { Link, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { useArchivedParams } from "./archivedParams";
import { useBranchName } from "./branchParams";
import { useGetNotificationByIsRead } from "@/api/products";

type ProductListItemProps = {
  title: string;
  body: string;
  time: string;
  viewed: boolean;
  navigateTo: string;
  branchName: string;
  item: any;
  // notification: any;
};

const AdminViewNotification = ({
  title,
  body,
  time,
  viewed,
  navigateTo,
  branchName,
  item,
}: // notification,
ProductListItemProps) => {
  console.log("viewed", viewed);
  console.log("navigateTo", navigateTo);
  const router = useRouter();
  const [notificationTime, setNotificationTime] = useState("");

  console.log("itesm", item);

  const containerStyle =
    item.isRead === "false" ? styles.unreadContainer : styles.readContainer;
  const insideContainerStyle =
    item.isRead === "false"
      ? styles.unreadInsideContainer
      : styles.readInsideContainer;
  const textContainerStyle =
    item.isRead === "false"
      ? styles.unreadTextContainer
      : styles.readTextContainer;

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

  const showNotification = useGetNotificationByIsRead();

  const handlePress = () => {
    // Alert.alert("Notification Pressed");
    if (navigateTo === "Location") {
      router.push(`/(admin)/places`);
      showNotification.mutate({
        id_notification: Number(item.id_notification),
      });
    }
    if (navigateTo === "Category") {
      router.push("/(admin)/category/quantity");
      showNotification.mutate({
        id_notification: Number(item.id_notification),
      });
    }
    if (navigateTo === "CategoryInBranch") {
      router.push(
        `/(admin)/locations?id_branch=${navigateTo}&branchName=${branchName}`
      );
      showNotification.mutate({
        id_notification: Number(item.id_notification),
      });
    }
  };

  const content = (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}
    >
      <View style={[styles.insideContainer, insideContainerStyle]}>
        <View style={[styles.textContainer, textContainerStyle]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
          <Text style={styles.time}>{notificationTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return content;
};

export default AdminViewNotification;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    width: "100%",
    borderRadius: 7,
  },
  unreadContainer: {
    backgroundColor: "lightblue",
  },
  readContainer: {
    backgroundColor: "white",
  },
  insideContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 7,
  },
  unreadInsideContainer: {
    backgroundColor: "lightblue",
  },
  readInsideContainer: {
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  unreadTextContainer: {
    backgroundColor: "lightblue",
  },
  readTextContainer: {
    backgroundColor: "white",
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
    paddingTop: "2%",
  },
});
