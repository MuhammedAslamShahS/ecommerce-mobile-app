import React from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { topCategories } from "../../constants/topCategories";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

const TopCategories = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Top Categories</Text>
      <Text style={styles.subtitle}>Categories people love the most</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {topCategories.map((category) => (
          <TouchableOpacity key={category.id} style={styles.card} activeOpacity={0.9}>
            <ImageBackground source={category.image} style={styles.image} imageStyle={styles.imageRadius}>
              <View style={styles.overlay} />
              <View style={styles.labelWrap}>
                <Text style={styles.label}>{category.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.white,
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
  list: {
    paddingTop: 28,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    gap: 14,
  },
  card: {
    width: 188,
    height: 300,
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
  },
  imageRadius: {
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  labelWrap: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  label: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "600",
  },
});

export default TopCategories;
