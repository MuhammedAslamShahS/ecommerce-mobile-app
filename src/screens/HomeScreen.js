import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Store Mobile App</Text>
      <Text style={styles.subtitle}>Android app setup started successfully.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: "center",
  },
});

export default HomeScreen;
