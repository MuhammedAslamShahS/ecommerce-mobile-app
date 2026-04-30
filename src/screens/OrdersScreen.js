import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OrdersScreen = ({ placedOrders, onStartShopping, bottomInset = 0 }) => {
  if (!placedOrders.length) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyCopy}>Place your first order and it will appear here with payment and address details.</Text>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={onStartShopping}>
            <Text style={styles.primaryButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My Orders</Text>
        <Text style={styles.pageCopy}>
          {placedOrders.length} order{placedOrders.length > 1 ? "s" : ""} placed successfully.
        </Text>

        {placedOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderTopRow}>
              <View style={styles.orderTopCopy}>
                <Text style={styles.orderId}>Order ID: {order.id}</Text>
                <Text style={styles.orderDate}>Placed on {order.createdAt}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{order.status}</Text>
              </View>
            </View>

            {order.items.map((item) => (
              <View key={`${order.id}-${item.id}`} style={styles.orderItem}>
                <Text style={styles.orderItemTitle}>{item.title}</Text>
                <Text style={styles.orderItemMeta}>
                  Qty: {item.quantity} | Price: Rs. {Number(item.price).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <Text style={styles.sectionText}>{order.address.fullName}</Text>
              <Text style={styles.sectionText}>{order.address.phone}</Text>
              <Text style={styles.sectionText}>
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}
              </Text>
              <Text style={styles.sectionText}>
                {order.address.city}, {order.address.state} - {order.address.postalCode}
              </Text>
              <Text style={styles.sectionText}>{order.address.country}</Text>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Payment & Total</Text>
              <Text style={styles.sectionText}>Payment: {order.paymentMethod.toUpperCase()}</Text>
              <Text style={styles.orderTotal}>Total: Rs. {Number(order.total).toFixed(2)}</Text>
            </View>
          </View>
        ))}
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
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  pageCopy: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
  },
  orderCard: {
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  orderTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  orderTopCopy: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  orderDate: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#fff1eb",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ff5a36",
  },
  orderItem: {
    marginTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  orderItemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  orderItemMeta: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
  },
  sectionBlock: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4b5563",
    marginTop: 2,
  },
  orderTotal: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 26,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  emptyCopy: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
    textAlign: "center",
  },
  primaryButton: {
    marginTop: 18,
    minHeight: 56,
    minWidth: 180,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5a36",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },
});

export default OrdersScreen;
