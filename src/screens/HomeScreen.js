import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

const categories = ["Women", "Men", "Kids", "Beauty", "Accessories"];

const featuredProducts = [
  {
    id: 1,
    title: "Premium Orange Hoodie",
    category: "Fashion",
    price: "₹1,499",
  },
  {
    id: 2,
    title: "Minimal White Sneakers",
    category: "Footwear",
    price: "₹2,299",
  },
  {
    id: 3,
    title: "Classic Black Watch",
    category: "Accessories",
    price: "₹3,199",
  },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>STORE</Text>
            <Text style={styles.subText}>Modern shopping in your pocket</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>New</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Spring drop</Text>
          <Text style={styles.heroTitle}>Discover premium shopping with bold style.</Text>
          <Text style={styles.heroDescription}>
            Explore fashion, accessories, and essentials with a clean mobile experience.
          </Text>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Shop now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search products"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((item) => (
            <TouchableOpacity key={item} style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <Text style={styles.sectionLink}>View all</Text>
        </View>

        <View style={styles.productList}>
          {featuredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                <Text style={styles.productImageText}>Image</Text>
              </View>

              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>

              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>View product</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.softWhite,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  brand: {
    fontSize: typography.headingSmall,
    fontWeight: "800",
    color: colors.black,
    letterSpacing: 1,
  },
  subText: {
    fontSize: typography.bodySmall,
    color: colors.muted,
    marginTop: 4,
  },
  badge: {
    backgroundColor: colors.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  heroCard: {
    backgroundColor: colors.black,
    borderRadius: 28,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroLabel: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  heroTitle: {
    color: colors.white,
    fontSize: typography.headingMedium,
    fontWeight: "800",
    lineHeight: 36,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    color: "#d8d8d8",
    fontSize: typography.body,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: typography.body,
    fontWeight: "700",
  },
  searchBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  searchInput: {
    fontSize: typography.body,
    color: colors.text,
    height: 48,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
  },
  sectionLink: {
    fontSize: typography.bodySmall,
    color: colors.primary,
    fontWeight: "600",
  },
  categoryRow: {
    paddingBottom: spacing.lg,
    gap: 12,
  },
  categoryChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  categoryChipText: {
    color: colors.text,
    fontSize: typography.bodySmall,
    fontWeight: "600",
  },
  productList: {
    gap: spacing.md,
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  productImagePlaceholder: {
    height: 180,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  productImageText: {
    color: colors.muted,
    fontSize: typography.bodySmall,
  },
  productCategory: {
    fontSize: typography.caption,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 1,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: typography.body,
    color: colors.text,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  secondaryButton: {
    backgroundColor: colors.softWhite,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.black,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
});

export default HomeScreen;
