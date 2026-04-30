import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import { getProductById } from "../services/products";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const storeLogo = require("../../assets/store-logo.png");
const FALLBACK_IMAGE = "https://via.placeholder.com/500x640/f5f5f5/999999?text=Product";

const ProductDetailsScreen = ({
  productId,
  bottomInset = 0,
  onBack,
  onAddToCart,
  onBuyNow,
  onOpenCart,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showCartPrompt, setShowCartPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getProductById(productId);

        if (isMounted) {
          setProduct(data);
          setQuantity(1);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const originalPrice = useMemo(() => {
    if (!product) {
      return 0;
    }

    return Number((product.price * 2).toFixed(0));
  }, [product]);

  const saveAmount = useMemo(() => {
    if (!product) {
      return 0;
    }

    return Math.max(originalPrice - product.price, 0);
  }, [originalPrice, product]);

  const availableStock = useMemo(() => Number(product?.stock ?? 0), [product]);
  const isOutOfStock = availableStock < 1;

  const increaseQuantity = () => {
    setQuantity((current) => {
      if (availableStock < 1) {
        return current;
      }

      return Math.min(current + 1, availableStock);
    });
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = async () => {
    if (!product || isOutOfStock || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddToCart?.(product, quantity);
      setShowCartPrompt(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || isOutOfStock || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setShowCartPrompt(false);
      await onBuyNow?.(product, quantity);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToCart = () => {
    setShowCartPrompt(false);
    onOpenCart?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.logoButton} activeOpacity={0.85} onPress={onBack}>
            <Image source={storeLogo} style={styles.logoImage} resizeMode="contain" />
          </TouchableOpacity>

          <View style={styles.searchShell}>
            <TextInput
              placeholder="Search products"
              placeholderTextColor="#8a7d76"
              style={styles.searchInput}
              underlineColorAndroid="transparent"
              selectionColor={colors.primary}
            />
            <Ionicons name="search-outline" size={22} color={colors.black} />
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.85}
            onPress={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? (
              <Ionicons name="close-outline" size={28} color={colors.black} />
            ) : (
              <SimpleLineIcons name="menu" size={18} color={colors.black} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.stateText}>Loading product details...</Text>
          </View>
        ) : null}

        {!isLoading && hasError ? (
          <View style={styles.stateWrap}>
            <Text style={styles.stateText}>Unable to load product details right now.</Text>
          </View>
        ) : null}

        {!isLoading && !hasError && product ? (
          <View style={styles.contentWrap}>
            <View style={styles.imageCard}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>-50%</Text>
              </View>

              <Image
                source={{ uri: product.image || FALLBACK_IMAGE }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.title}</Text>
              <TouchableOpacity style={styles.wishlistButton} activeOpacity={0.88}>
                <Feather name="heart" size={22} color="#90857f" />
              </TouchableOpacity>
            </View>

            <Text style={styles.ratingText}>Rating 4.5/5 (324 reviews)</Text>
            <View style={styles.divider} />

            <View style={styles.priceSummary}>
              <View>
                <Text style={styles.currentPrice}>Rs. {product.price.toFixed(2)}</Text>
                <Text style={styles.saveText}>You save Rs. {saveAmount.toFixed(2)}</Text>
              </View>
              <Text style={styles.originalPrice}>Rs. {originalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.quantityCard}>
              <Text style={styles.quantityLabel}>Select Quantity:</Text>

              <View style={styles.quantitySelector}>
                <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity} activeOpacity={0.85}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <View style={styles.quantityValueWrap}>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                </View>

                <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity} activeOpacity={0.85}>
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.stockText}>
                {isOutOfStock ? "Currently out of stock" : `Stock Available: ${availableStock}`}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.outlineCta, isOutOfStock && styles.disabledOutlineCta]}
              activeOpacity={0.9}
              onPress={handleAddToCart}
              disabled={isOutOfStock || isSubmitting}
            >
              <Text style={[styles.outlineCtaText, isOutOfStock && styles.disabledOutlineCtaText]}>
                {isSubmitting ? "ADDING..." : "ADD TO CART"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryCta, isOutOfStock && styles.disabledPrimaryCta]}
              activeOpacity={0.9}
              onPress={handleBuyNow}
              disabled={isOutOfStock || isSubmitting}
            >
              <Text style={styles.primaryCtaText}>{isOutOfStock ? "OUT OF STOCK" : "BUY NOW"}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showCartPrompt}
        onRequestClose={() => setShowCartPrompt(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCartPrompt(false)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.modalTitle}>Item added to cart</Text>
            <Text style={styles.modalText}>Choose what you want to do next.</Text>

            <TouchableOpacity style={styles.modalPrimaryAction} activeOpacity={0.9} onPress={handleBuyNow}>
              <Text style={styles.modalPrimaryActionText}>Proceed to Buy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalSecondaryAction} activeOpacity={0.9} onPress={handleGoToCart}>
              <Text style={styles.modalSecondaryActionText}>Go to Cart</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#eaf5f8",
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 251, 248, 0.96)",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(40, 32, 27, 0.12)",
    gap: 12,
  },
  logoButton: {
    width: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 34,
    height: 34,
  },
  searchShell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 36,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(40, 32, 27, 0.14)",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 36,
    color: colors.text,
    fontSize: typography.bodySmall,
    textAlign: "center",
    borderWidth: 0,
    outlineStyle: "none",
    backgroundColor: "transparent",
    paddingVertical: 0,
    textAlignVertical: "center",
  },
  menuButton: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 58,
  },
  stateWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  stateText: {
    fontSize: typography.bodySmall,
    color: colors.muted,
  },
  contentWrap: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  imageCard: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: "#ff5a36",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  discountBadgeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  productImage: {
    width: "100%",
    height: 285,
  },
  titleRow: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "700",
    color: "#1d2430",
  },
  wishlistButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#e7e2dd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  ratingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#1f1f1f",
  },
  divider: {
    marginTop: 18,
    marginBottom: 18,
    height: 1,
    backgroundColor: "#e5e1de",
  },
  priceSummary: {
    backgroundColor: "#e9f7eb",
    borderLeftWidth: 4,
    borderLeftColor: "#27b45d",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  currentPrice: {
    color: "#1eb35d",
    fontSize: 22,
    fontWeight: "800",
  },
  saveText: {
    marginTop: 8,
    color: "#1eb35d",
    fontSize: 15,
    fontWeight: "600",
  },
  originalPrice: {
    color: "#8c8f93",
    fontSize: 18,
    textDecorationLine: "line-through",
    paddingTop: 4,
  },
  quantityCard: {
    marginTop: 20,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  quantitySelector: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: colors.white,
  },
  quantityButton: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  quantityButtonText: {
    fontSize: 22,
    color: "#5b5b5b",
  },
  quantityValueWrap: {
    width: 46,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityValue: {
    fontSize: 18,
    color: "#111827",
    fontWeight: "600",
  },
  stockText: {
    marginTop: 14,
    color: "#9196a0",
    fontSize: 14,
  },
  outlineCta: {
    marginTop: 20,
    minHeight: 56,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ff5a36",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  outlineCtaText: {
    color: "#ff5a36",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  disabledOutlineCta: {
    borderColor: "#f4c8bc",
    backgroundColor: "#fff7f4",
  },
  disabledOutlineCtaText: {
    color: "#d6a395",
  },
  primaryCta: {
    marginTop: 14,
    minHeight: 56,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5a36",
  },
  primaryCtaText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  disabledPrimaryCta: {
    backgroundColor: "#f0b7aa",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 24,
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  modalText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#6b7280",
  },
  modalPrimaryAction: {
    marginTop: 22,
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#ff5a36",
    alignItems: "center",
    justifyContent: "center",
  },
  modalPrimaryActionText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  modalSecondaryAction: {
    marginTop: 12,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
  },
  modalSecondaryActionText: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default ProductDetailsScreen;
