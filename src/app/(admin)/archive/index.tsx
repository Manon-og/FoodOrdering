import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Link href={`/(admin)/menu?category=1&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/cookies.png")} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>COOKIE</Text>
          </Pressable>
        </Link>

        <Link href={`/(admin)/menu?category=2&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/bread.png")} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>BREADS</Text>
          </Pressable>
        </Link>

        <Link href={`/(admin)/menu?category=3&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/cakes.png")} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>CAKES</Text>
          </Pressable>
        </Link>

        <Link href={`/(admin)/menu?category=4&id_archive=1`} asChild>
          <Pressable style={styles.categoryCard}>
            <Image
              source={require("../../../../assets/images/bentocakes.png")} 
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>BENTO CAKES</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#B9D2F7", // Light blue background for the whole screen
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 30, // Adjusted margin to match the original layout
  },
  categoryCard: {
    width: "40%",
    height: "35%",
    backgroundColor: "#FDFDFD",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 15,
    overflow: "hidden", // To prevent image overflow
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1,  
    elevation: 5,       
  },
  categoryImage: {
    width: "100%",
    height: "81%", // Adjust the height as needed
    resizeMode: "cover",
    marginBottom: 10, // Space between image and text
    marginTop: "-12%",
  },
  categoryText: {
    color: "black", // Black text for category names
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
    textAlign: "center", // Center text in the button
    marginTop: 5,
  },
});
