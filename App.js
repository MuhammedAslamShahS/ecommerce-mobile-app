import React, { useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";

const initialAddresses = [
  {
    id: "address-1",
    fullName: "Muhammed Aslam",
    phone: "+91 98765 43210",
    line1: "18/404, Market Road",
    line2: "Near Town Hall",
    city: "Kozhikode",
    state: "Kerala",
    postalCode: "673001",
    country: "India",
    isDefault: true,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [buyNowOrder, setBuyNowOrder] = useState(null);
  const [checkoutState, setCheckoutState] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0]?.id || "");

  const tabs = useMemo(
    () => [
      { key: "Home", label: "Home", icon: <Feather name="home" size={20} /> },
      { key: "Orders", label: "Orders", icon: <MaterialCommunityIcons name="format-list-bulleted" size={21} /> },
      { key: "Cart", label: "Cart", icon: <Feather name="shopping-cart" size={20} /> },
      { key: "Account", label: "Account", icon: <Ionicons name="person-outline" size={20} /> },
    ],
    []
  );

  const cartSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return {
      totalItems,
      subtotal,
    };
  }, [cartItems]);

  const handleAddToCart = (product, quantity) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, Number(product.stock ?? item.quantity + quantity)),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          price: Number(product.price),
          quantity,
          stock: Number(product.stock ?? quantity),
        },
      ];
    });
  };

  const handleBuyNow = (product, quantity) => {
    const nextBuyNowOrder = {
      id: product.id,
      title: product.title,
      price: Number(product.price),
      quantity,
      total: Number(product.price) * quantity,
    };

    setBuyNowOrder(nextBuyNowOrder);
    setCheckoutState({
      source: "buy-now",
      items: [nextBuyNowOrder],
    });
    setSelectedProductId(null);
    setActiveTab("Orders");
  };

  const handleOpenCart = () => {
    setSelectedProductId(null);
    setActiveTab("Cart");
  };

  const handleOpenCheckoutFromCart = () => {
    if (!cartItems.length) {
      return;
    }

    setCheckoutState({
      source: "cart",
      items: cartItems.map((item) => ({
        id: item.id,
        productId: item.id,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    });
    setActiveTab("Orders");
  };

  const handleAddAddress = (addressForm) => {
    const nextAddress = {
      id: `address-${Date.now()}`,
      ...addressForm,
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses((currentAddresses) => [...currentAddresses, nextAddress]);
    setSelectedAddressId(nextAddress.id);
  };

  const handleCancelCheckout = () => {
    if (checkoutState?.source === "cart") {
      setActiveTab("Cart");
      return;
    }

    setActiveTab("Home");
  };

  const handlePlaceOrder = ({ selectedPayment, selectedAddress }) => {
    const totalItems = checkoutState?.items?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

    if (checkoutState?.source === "cart") {
      setCartItems([]);
    }

    setBuyNowOrder(null);
    setCheckoutState(null);
    setActiveTab("Home");

    Alert.alert(
      "Order placed",
      `${totalItems} item${totalItems > 1 ? "s" : ""} confirmed for ${selectedAddress.fullName} via ${selectedPayment.toUpperCase()}.`
    );
  };

  const renderScreen = () => {
    if (activeTab === "Home") {
      if (selectedProductId) {
        return (
          <ProductDetailsScreen
            productId={selectedProductId}
            bottomInset={92}
            onBack={() => setSelectedProductId(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onOpenCart={handleOpenCart}
          />
        );
      }

      return <HomeScreen bottomInset={92} onSelectProduct={setSelectedProductId} />;
    }

    if (activeTab === "Cart") {
      return (
        <SafeAreaView style={styles.summaryScreen}>
          <ScrollView contentContainerStyle={styles.summaryContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.summaryTitle}>Your Cart</Text>
            <Text style={styles.summaryCopy}>
              {cartSummary.totalItems > 0
                ? `${cartSummary.totalItems} item${cartSummary.totalItems > 1 ? "s" : ""} ready for checkout.`
                : "Your cart is empty. Add a product from the details page to see it here."}
            </Text>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.summaryCard}>
                <Text style={styles.summaryCardTitle}>{item.title}</Text>
                <Text style={styles.summaryCardMeta}>Qty: {item.quantity}</Text>
                <Text style={styles.summaryCardMeta}>Price: Rs. {item.price.toFixed(2)}</Text>
                <Text style={styles.summaryCardTotal}>Total: Rs. {(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}

            {cartSummary.totalItems > 0 ? (
              <View style={styles.highlightCard}>
                <Text style={styles.highlightLabel}>Cart Subtotal</Text>
                <Text style={styles.highlightValue}>Rs. {cartSummary.subtotal.toFixed(2)}</Text>
              </View>
            ) : null}

            {cartSummary.totalItems > 0 ? (
              <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.88} onPress={handleOpenCheckoutFromCart}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      );
    }

    if (activeTab === "Orders") {
      if (checkoutState?.items?.length) {
        return (
          <CheckoutScreen
            items={checkoutState.items}
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onAddAddress={handleAddAddress}
            onPlaceOrder={handlePlaceOrder}
            onCancel={handleCancelCheckout}
          />
        );
      }

      return (
        <SafeAreaView style={styles.summaryScreen}>
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Checkout</Text>
            <Text style={styles.summaryCopy}>
              {buyNowOrder
                ? "Your Buy Now selection is ready. Review the order summary below."
                : "Use Buy Now from a product details page to open a direct checkout flow here."}
            </Text>

            {buyNowOrder ? (
              <View style={styles.highlightCard}>
                <Text style={styles.summaryCardTitle}>{buyNowOrder.title}</Text>
                <Text style={styles.summaryCardMeta}>Qty: {buyNowOrder.quantity}</Text>
                <Text style={styles.summaryCardMeta}>Price: Rs. {buyNowOrder.price.toFixed(2)}</Text>
                <Text style={styles.highlightValue}>Pay Now: Rs. {buyNowOrder.total.toFixed(2)}</Text>
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      );
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
  summaryScreen: {
    flex: 1,
    backgroundColor: "#f6f8fb",
  },
  summaryContent: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 120,
  },
  summaryTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },
  summaryCopy: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
  },
  summaryCard: {
    marginTop: 18,
    borderRadius: 18,
    padding: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  summaryCardMeta: {
    marginTop: 8,
    fontSize: 15,
    color: "#4b5563",
  },
  summaryCardTotal: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "700",
    color: "#ff5a36",
  },
  highlightCard: {
    marginTop: 22,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe2ea",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 4,
  },
  highlightLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  highlightValue: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  checkoutButton: {
    marginTop: 18,
    minHeight: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5a36",
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
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
