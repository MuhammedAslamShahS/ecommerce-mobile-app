import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { getAllProducts } from "../../services/products";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x360/f5f5f5/999999?text=Product";

const chunkProducts = (products, chunkSize) => {
  const rows = [];

  for (let index = 0; index < products.length; index += chunkSize) {
    rows.push(products.slice(index, index + chunkSize));
  }

  return rows;
};

const AllProducts = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getAllProducts();

        if (isMounted) {
          setProducts(data);
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

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const productRows = useMemo(() => chunkProducts(products, 2), [products]);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>All Products</Text>
      <Text style={styles.subtitle}>Explore everything in store</Text>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.stateText}>Loading products...</Text>
        </View>
      ) : null}

      {!isLoading && hasError ? (
        <View style={styles.stateWrap}>
          <Text style={styles.stateText}>Unable to load products right now.</Text>
        </View>
      ) : null}

      {!isLoading && !hasError ? (
        <View style={styles.grid}>
          {productRows.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.card}
                  activeOpacity={0.9}
                  onPress={() => onSelectProduct?.(product.id)}
                >
                  <View style={styles.imageWrap}>
                    <View style={styles.wishlistButton}>
                      <Feather name="heart" size={16} color="#8d827b" />
                    </View>

                    <View style={styles.priceBadge}>
                      <Text style={styles.priceBadgeText}>Rs. {product.price.toFixed(0)}</Text>
                    </View>

                    <Image
                      source={{ uri: product.image || FALLBACK_IMAGE }}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.category} numberOfLines={1}>
                      {product.category || "Product"}
                    </Text>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {product.title}
                    </Text>
                    <View style={styles.ctaButton}>
                      <Text style={styles.ctaText}>Product details</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {row.length === 1 ? <View style={styles.cardPlaceholder} /> : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.softWhite,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: typography.body,
    color: colors.muted,
    textAlign: "center",
  },
  stateWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
    gap: 10,
  },
  stateText: {
    fontSize: typography.bodySmall,
    color: colors.muted,
  },
  grid: {
    marginTop: 28,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    gap: 14,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffe1d4",
    shadowColor: "#ff8f6a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  cardPlaceholder: {
    flex: 1,
  },
  imageWrap: {
    position: "relative",
    height: 144,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    left: 8,
    zIndex: 3,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  priceBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 2,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  priceBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  image: {
    width: "84%",
    height: "82%",
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 14,
    minHeight: 116,
  },
  category: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "700",
    color: "#bf360c",
    textTransform: "uppercase",
    marginBottom: 6,
    backgroundColor: "#fff1eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  productTitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
    color: colors.black,
    minHeight: 40,
  },
  ctaButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 3,
  },
  ctaText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
});

export default AllProducts;
