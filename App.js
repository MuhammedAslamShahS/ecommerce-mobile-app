import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./src/screens/HomeScreen";
import ProductDetailsScreen from "./src/screens/ProductDetailsScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import CartScreen from "./src/screens/CartScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import AccountScreen from "./src/screens/AccountScreen";

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

const accountProfile = {
  name: "Muhammed Aslam",
  email: "muhammedaslamshahsofficial@gmail.com",
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutState, setCheckoutState] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialAddresses[0]?.id || "");
  const [placedOrders, setPlacedOrders] = useState([]);

  const tabs = useMemo(
    () => [
      { key: "Home", label: "Home", icon: <Feather name="home" size={20} /> },
      { key: "Orders", label: "Orders", icon: <MaterialCommunityIcons name="format-list-bulleted" size={21} /> },
      { key: "Cart", label: "Cart", icon: <Feather name="shopping-cart" size={20} /> },
      { key: "Account", label: "Account", icon: <Ionicons name="person-outline" size={20} /> },
    ],
    []
  );

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
    const nextBuyNowItem = {
      id: product.id,
      productId: product.id,
      title: product.title,
      price: Number(product.price),
      quantity,
    };

    setCheckoutState({
      source: "buy-now",
      items: [nextBuyNowItem],
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
    setCheckoutState(null);

    if (checkoutState?.source === "cart") {
      setActiveTab("Cart");
      return;
    }

    setActiveTab("Home");
  };

  const handlePlaceOrder = ({ selectedPayment, selectedAddress }) => {
    const checkoutItems = checkoutState?.items || [];
    const totalItems = checkoutItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    const orderTotal = checkoutItems.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);

    if (checkoutState?.source === "cart") {
      setCartItems([]);
    }

    setPlacedOrders((currentOrders) => [
      {
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        status: "PLACED",
        paymentMethod: selectedPayment,
        address: selectedAddress,
        items: checkoutItems,
        total: orderTotal,
      },
      ...currentOrders,
    ]);

    setCheckoutState(null);
    setActiveTab("Orders");

    Alert.alert(
      "Order placed",
      `${totalItems} item${totalItems > 1 ? "s" : ""} confirmed for ${selectedAddress.fullName} via ${selectedPayment.toUpperCase()}.`
    );
  };

  const handleIncrementCartItem = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(item.quantity + 1, Number(item.stock ?? item.quantity + 1)),
            }
          : item
      )
    );
  };

  const handleDecrementCartItem = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleRemoveCartItem = (itemId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const handleOpenOrders = () => {
    setActiveTab("Orders");
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
        <CartScreen
          cartItems={cartItems}
          onIncrement={handleIncrementCartItem}
          onDecrement={handleDecrementCartItem}
          onRemove={handleRemoveCartItem}
          onProceedCheckout={handleOpenCheckoutFromCart}
          bottomInset={92}
        />
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
        <OrdersScreen placedOrders={placedOrders} onStartShopping={() => setActiveTab("Home")} bottomInset={92} />
      );
    }

    return (
      <AccountScreen
        profile={accountProfile}
        savedAddresses={savedAddresses}
        cartItems={cartItems}
        placedOrders={placedOrders}
        onOpenCart={handleOpenCart}
        onOpenOrders={handleOpenOrders}
        bottomInset={92}
      />
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
