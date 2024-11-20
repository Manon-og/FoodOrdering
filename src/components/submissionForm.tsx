import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import Button from "@/src/components/Button";
import React, { useState } from "react";
import Colors from "@/src/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { useInsertBranch } from "@/src/api/products";

const CreateBranchScreen = () => {
  const [place, setPlace] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const { mutate: insertLocation } = useInsertBranch();
  const router = useRouter();

  const validate = () => {
    setError("");
    if (!place || !street || !city || !postal || !country) {
      setError("Please fill all fields");
      return false;
    }
    return true;
  };

  const resetFields = () => {
    setPlace("");
    setStreet("");
    setCity("");
    setPostal("");
    setCountry("");
  };

  const onCreate = () => {
    if (!validate()) {
      return;
    }
    insertLocation(
      {
        place,
        street,
        city,
        postal_code: Number(postal),
        country,
      },
      {
        onSuccess: () => {
          resetFields();
          router.back();
          Alert.alert("Success", `${place} location has been added!`);
        },
        onError: (error) => {
          console.error("Insert Branch Error:", error);
          Alert.alert("Error", "Failed to add the branch.");
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Add Location" }} />

      <Text style={styles.label}>Place</Text>
      <TextInput
        value={place}
        onChangeText={setPlace}
        placeholder="Place"
        style={styles.input}
        maxLength={30}
      />
      <Text style={styles.label}>Street</Text>
      <TextInput
        value={street}
        onChangeText={setStreet}
        placeholder="Street"
        style={styles.input}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="City"
        style={styles.input}
        maxLength={255}
      />

      <Text style={styles.label}>Postal Code</Text>
      <TextInput
        value={postal}
        onChangeText={setPostal}
        placeholder="Postal Code"
        style={styles.input}
        maxLength={255}
      />

      <Text style={styles.label}>Country</Text>
      <TextInput
        value={country}
        onChangeText={setCountry}
        placeholder="Country"
        style={styles.lastInput}
        maxLength={255}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button onPress={onCreate} text={"Create"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  lastInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: "40%",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "gray",
  },
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default CreateBranchScreen;
