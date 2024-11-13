import { View, Text, TextInput, StyleSheet, Alert, Image } from "react-native";
import React, { useState } from "react";
import Button from "../../components/Button";
import Colors from "../../constants/Colors";
import { Link, Stack } from "expo-router";
import { useSignIn } from "src/api/products";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutate: signIn } = useSignIn();

  const handleSignIn = () => {
    setLoading(true);
    signIn(
      { email, password },
      {
        onError: (error) => {
          Alert.alert(error.message);
          setLoading(false);
        },
        onSuccess: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign in" }} />
      <Image
        // source={require("../../../assets/images/logo.png")} // FIX THIS LATER
        style={styles.image}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="example@gmail.com"
        style={styles.input}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />
      <Button
        onPress={handleSignIn}
        disabled={loading}
        text={loading ? "Signing in..." : "Sign In"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#B9D2F7", // Set background color
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  label: {
    color: "black",
  },
  input: {
    borderWidth: 1,
    borderColor: "#0E1432",
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 7,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignInScreen;