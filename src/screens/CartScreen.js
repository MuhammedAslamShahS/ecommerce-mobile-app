import React, { useMemo } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CartScreen = ({ cartItems, onIncrement, onDecrement, onRemove, onProceedCheckout, bottomInset = 0 }) => {
  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.quantity), 0), [cartItems]);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0),
    [cartItems]
  );

  if (!cartItems.length) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCopy}>Add products from the details page to see them here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomInset }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My Cart</Text>
        <Text style={styles.pageCopy}>
          {totalItems} item{totalItems > 1 ? "s" : ""} ready for checkout.
        </Text>

        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <TouchableOpacity activeOpacity={0.85} onPress={() => onRemove?.(item.id)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.metaText}>Price: Rs. {Number(item.price).toFixed(2)}</Text>
            <Text style={styles.metaText}>Subtotal: Rs. {(Number(item.price) * Number(item.quantity)).toFixed(2)}</Text>

            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[styles.quantityButton, item.quantity === 1 && styles.quantityButtonDisabled]}
                  activeOpacity={0.85}
                  onPress={() => onDecrement?.(item.id)}
                  disabled={item.quantity === 1}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <View style={styles.quantityValueWrap}>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                </View>

                <TouchableOpacity style={styles.quantityButton} activeOpacity={0.85} onPress={() => onIncrement?.(item.id)}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Cart Subtotal</Text>
          <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={onProceedCheckout}>
          <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
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
  card: {
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  removeText: {
    color: "#ff5a36",
    fontSize: 14,
    fontWeight: "700",
  },
  metaText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  quantityRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityButton: {
    width: 42,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  quantityButtonDisabled: {
    opacity: 0.45,
  },
  quantityButtonText: {
    fontSize: 22,
    color: "#111827",
  },
  quantityValueWrap: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  summaryCard: {
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe2ea",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  summaryValue: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  primaryButton: {
    marginTop: 18,
    minHeight: 56,
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
});

export default CartScreen;
