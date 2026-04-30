import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const emptyAddressForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const paymentOptions = [
  {
    id: "cod",
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    id: "upi",
    title: "UPI",
    description: "Pay instantly using your UPI app",
  },
  {
    id: "card",
    title: "Credit / Debit Card",
    description: "Pay securely using your card",
  },
];

const CheckoutScreen = ({
  items,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onPlaceOrder,
  onCancel,
}) => {
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [items]);

  const selectedAddress = useMemo(() => {
    return addresses.find((address) => address.id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  const resetAddressForm = () => {
    setAddressForm(emptyAddressForm);
  };

  const openAddAddressModal = () => {
    resetAddressForm();
    setIsAddressModalVisible(true);
  };

  const closeAddAddressModal = () => {
    setIsAddressModalVisible(false);
    resetAddressForm();
  };

  const handleAddressInputChange = (field, value) => {
    setAddressForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSaveAddress = () => {
    const requiredFields = ["fullName", "phone", "line1", "city", "state", "postalCode", "country"];
    const hasMissingField = requiredFields.some((field) => !addressForm[field].trim());

    if (hasMissingField) {
      Alert.alert("Incomplete address", "Please fill in all required address details.");
      return;
    }

    onAddAddress?.(addressForm);
    closeAddAddressModal();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Select address", "Please choose a delivery address to continue.");
      return;
    }

    if (!selectedPayment) {
      Alert.alert("Select payment", "Please choose a payment method to continue.");
      return;
    }

    try {
      setIsPlacingOrder(true);
      await onPlaceOrder?.({
        selectedPayment,
        selectedAddress,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!items.length) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No items available for checkout</Text>
          <Text style={styles.emptyStateCopy}>Add products from the product details page to continue.</Text>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.88} onPress={onCancel}>
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Checkout</Text>
        <Text style={styles.pageCopy}>Review your items, choose the delivery address, and complete payment.</Text>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemCopy}>
                <Text style={styles.orderItemTitle}>{item.title}</Text>
                <Text style={styles.orderItemMeta}>Qty: {item.quantity}</Text>
                <Text style={styles.orderItemMeta}>Price: Rs. {Number(item.price).toFixed(2)}</Text>
              </View>
              <Text style={styles.orderItemTotal}>Rs. {(Number(item.price) * Number(item.quantity)).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity style={styles.textAction} activeOpacity={0.85} onPress={openAddAddressModal}>
              <Text style={styles.textActionLabel}>{addresses.length ? "Change / Add" : "Add Address"}</Text>
            </TouchableOpacity>
          </View>

          {selectedAddress ? (
            <View style={styles.selectedAddressCard}>
              <View style={styles.addressTopRow}>
                <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
                {selectedAddress.isDefault ? <Text style={styles.defaultBadge}>Default</Text> : null}
              </View>
              <Text style={styles.addressText}>{selectedAddress.phone}</Text>
              <Text style={styles.addressText}>
                {selectedAddress.line1}
                {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}
              </Text>
              <Text style={styles.addressText}>
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
              </Text>
              <Text style={styles.addressText}>{selectedAddress.country}</Text>
            </View>
          ) : (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>No delivery address selected yet.</Text>
            </View>
          )}

          {addresses.length ? (
            <View style={styles.addressOptions}>
              {addresses.map((address) => {
                const isSelected = address.id === selectedAddressId;

                return (
                  <TouchableOpacity
                    key={address.id}
                    style={[styles.addressOption, isSelected && styles.addressOptionSelected]}
                    activeOpacity={0.9}
                    onPress={() => onSelectAddress?.(address.id)}
                  >
                    <View style={styles.radioOuter}>{isSelected ? <View style={styles.radioInner} /> : null}</View>
                    <View style={styles.addressOptionCopy}>
                      <Text style={styles.addressOptionName}>{address.fullName}</Text>
                      <Text style={styles.addressOptionText}>
                        {address.city}, {address.state}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.88} onPress={openAddAddressModal}>
              <Text style={styles.secondaryButtonText}>Add Address</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentOptions.map((option) => {
            const isSelected = option.id === selectedPayment;

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.paymentOption, isSelected && styles.paymentOptionSelected]}
                activeOpacity={0.9}
                onPress={() => setSelectedPayment(option.id)}
              >
                <View style={styles.radioOuter}>{isSelected ? <View style={styles.radioInner} /> : null}</View>
                <View style={styles.paymentCopy}>
                  <Text style={styles.paymentTitle}>{option.title}</Text>
                  <Text style={styles.paymentDescription}>{option.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isPlacingOrder && styles.primaryButtonDisabled]}
          activeOpacity={0.9}
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          <Text style={styles.primaryButtonText}>{isPlacingOrder ? "Placing Order..." : "Place Order"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.88} onPress={onCancel} disabled={isPlacingOrder}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent animationType="slide" visible={isAddressModalVisible} onRequestClose={closeAddAddressModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Address</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={addressForm.fullName}
                onChangeText={(value) => handleAddressInputChange("fullName", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                value={addressForm.phone}
                onChangeText={(value) => handleAddressInputChange("phone", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Address Line 1"
                value={addressForm.line1}
                onChangeText={(value) => handleAddressInputChange("line1", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Address Line 2"
                value={addressForm.line2}
                onChangeText={(value) => handleAddressInputChange("line2", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={addressForm.city}
                onChangeText={(value) => handleAddressInputChange("city", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={addressForm.state}
                onChangeText={(value) => handleAddressInputChange("state", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                keyboardType="number-pad"
                value={addressForm.postalCode}
                onChangeText={(value) => handleAddressInputChange("postalCode", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={addressForm.country}
                onChangeText={(value) => handleAddressInputChange("country", value)}
              />
            </ScrollView>

            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleSaveAddress}>
              <Text style={styles.primaryButtonText}>Save Address</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} activeOpacity={0.88} onPress={closeAddAddressModal}>
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f8fb",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 120,
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
  sectionCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  textAction: {
    paddingVertical: 6,
  },
  textActionLabel: {
    color: "#ff5a36",
    fontSize: 14,
    fontWeight: "700",
  },
  orderItem: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  orderItemCopy: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  orderItemMeta: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ff5a36",
  },
  totalRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  selectedAddressCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  addressTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#fff1eb",
    color: "#ff5a36",
    fontSize: 12,
    fontWeight: "700",
  },
  addressText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 21,
    color: "#4b5563",
  },
  infoBox: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoBoxText: {
    color: "#6b7280",
    fontSize: 14,
  },
  addressOptions: {
    marginTop: 14,
    gap: 10,
  },
  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  addressOptionSelected: {
    borderColor: "#ff5a36",
    backgroundColor: "#fff7f4",
  },
  addressOptionCopy: {
    flex: 1,
  },
  addressOptionName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  addressOptionText: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#ff5a36",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#ff5a36",
  },
  paymentOption: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  paymentOptionSelected: {
    borderColor: "#ff5a36",
    backgroundColor: "#fff7f4",
  },
  paymentCopy: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  paymentDescription: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 22,
    minHeight: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5a36",
  },
  primaryButtonDisabled: {
    backgroundColor: "#f1b4a6",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    marginTop: 12,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.42)",
    justifyContent: "flex-end",
  },
  modalCard: {
    maxHeight: "88%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 34,
    backgroundColor: "#ffffff",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe2ea",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fbfcfd",
    marginTop: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  emptyStateCopy: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default CheckoutScreen;
