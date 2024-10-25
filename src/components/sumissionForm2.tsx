import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { Stack } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Button from "@/src/components/Button";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const GOOGLE_API_KEY = "AIzaSyA1bZXmsZDIxkysBNLdCpHLhfCVZIVP0RE";

interface FormData {
  id: string;
  place: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

const SubmissionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    id: uuidv4(),
    place: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    latitude: null,
    longitude: null,
  });

  const handleChange = (name: string, value: string | number | null) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { place, street, city, postalCode, country, latitude, longitude } =
      formData;

    if (
      !place ||
      !street ||
      !city ||
      !postalCode ||
      !country ||
      latitude === null ||
      longitude === null
    ) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const { error } = await supabase.from("branch").insert([
      {
        id: formData.id,
        place,
        street,
        city,
        postal_code: postalCode,
        country,
        latitude,
        longitude,
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Branch added successfully!");
      setFormData({
        id: uuidv4(),
        place: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
        latitude: null,
        longitude: null,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Create Location" }} />
      <Text style={styles.label}>Place</Text>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={(data, details) => {
          const { lat, lng }: any = details?.geometry.location;
          setFormData({
            ...formData,
            place: data.description,
            latitude: lat,
            longitude: lng,
          });
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
        }}
        fetchDetails={true}
        styles={{
          textInput: styles.input,
        }}
      />

      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        placeholder="Street"
        value={formData.street}
        onChangeText={(value) => handleChange("street", value)}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="City"
        value={formData.city}
        onChangeText={(value) => handleChange("city", value)}
      />

      <Text style={styles.label}>Postal Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={formData.postalCode}
        onChangeText={(value) => handleChange("postalCode", value)}
      />

      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={formData.country}
        onChangeText={(value) => handleChange("country", value)}
      />

      {formData.latitude && formData.longitude && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: formData.latitude,
            longitude: formData.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: formData.latitude,
              longitude: formData.longitude,
            }}
            title={formData.place}
          />
        </MapView>
      )}

      <Button text="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "black",
  },
  map: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
});

export default SubmissionForm;
