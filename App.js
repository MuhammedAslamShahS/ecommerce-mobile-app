import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const tabs = useMemo(
    () => [
      { key: "Home", label: "Home", icon: <Feather name="home" size={20} /> },
      { key: "Orders", label: "Orders", icon: <MaterialCommunityIcons name="format-list-bulleted" size={21} /> },
      { key: "Cart", label: "Cart", icon: <Feather name="shopping-cart" size={20} /> },
      { key: "Account", label: "Account", icon: <Ionicons name="person-outline" size={20} /> },
    ],
    []
  );

  const renderScreen = () => {
    if (activeTab === "Home") {
      if (selectedProductId) {
        return (
          <ProductDetailsScreen
            productId={selectedProductId}
            bottomInset={92}
            onBack={() => setSelectedProductId(null)}
          />
        );
      }

      return <HomeScreen bottomInset={92} onSelectProduct={setSelectedProductId} />;
    }

    return (
      <SafeAreaView style={styles.placeholderScreen}>
        <Text style={styles.placeholderTitle}>{activeTab}</Text>
        <Text style={styles.placeholderCopy}>This tab is ready for the next mobile app screen.</Text>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.appShell}>
      {renderScreen()}

      <View style={styles.bottomNav}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.bottomNavItem}
              activeOpacity={0.85}
              onPress={() => {
                setActiveTab(tab.key);
                if (tab.key === "Home") {
                  setSelectedProductId(null);
                }
              }}
            >
              <View style={[styles.iconWrap, isActive && styles.activeIconWrap]}>
                {React.cloneElement(tab.icon, {
                  color: isActive ? "#215cff" : "#556274",
                })}
              </View>
              <Text style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: "#eaf5f8",
  },
  placeholderScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 24,
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  placeholderCopy: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
    paddingBottom: 8,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconWrap: {
    minHeight: 22,
    justifyContent: "center",
  },
  activeIconWrap: {
    transform: [{ translateY: -1 }],
  },
  bottomNavLabel: {
    fontSize: 13,
    color: "#556274",
    fontWeight: "500",
  },
  bottomNavLabelActive: {
    color: "#215cff",
  },
});
