import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AccountScreen = ({ profile, savedAddresses, cartItems, placedOrders, onOpenCart, onOpenOrders, bottomInset = 0 }) => {
  const defaultAddress = useMemo(() => savedAddresses.find((address) => address.isDefault) || savedAddresses[0] || null, [
    savedAddresses,
  ]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{profile.name}</Text>
          <Text style={styles.heroEmail}>{profile.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{placedOrders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cartItems.length}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{savedAddresses.length}</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Default Address</Text>

          {defaultAddress ? (
            <>
              <Text style={styles.addressName}>{defaultAddress.fullName}</Text>
              <Text style={styles.addressText}>{defaultAddress.phone}</Text>
              <Text style={styles.addressText}>
                {defaultAddress.line1}
                {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}
              </Text>
              <Text style={styles.addressText}>
                {defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postalCode}
              </Text>
              <Text style={styles.addressText}>{defaultAddress.country}</Text>
            </>
          ) : (
            <Text style={styles.mutedCopy}>No address saved yet.</Text>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.88} onPress={onOpenOrders}>
            <Text style={styles.actionLabel}>View Orders</Text>
            <Text style={styles.actionHint}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow} activeOpacity={0.88} onPress={onOpenCart}>
            <Text style={styles.actionLabel}>Open Cart</Text>
            <Text style={styles.actionHint}>Open</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f8fb",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  heroCard: {
    borderRadius: 22,
    padding: 22,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  heroEmail: {
    marginTop: 8,
    fontSize: 15,
    color: "#6b7280",
  },
  statsRow: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
  sectionCard: {
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  addressName: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  addressText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: "#4b5563",
  },
  mutedCopy: {
    marginTop: 14,
    fontSize: 14,
    color: "#6b7280",
  },
  actionRow: {
    marginTop: 14,
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  actionHint: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ff5a36",
  },
});

export default AccountScreen;
