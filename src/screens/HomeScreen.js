import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
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
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

const storeLogo = require("../../assets/store-logo.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 760;
const HEADER_HEIGHT = 61;
const SLIDE_WIDTH = SCREEN_WIDTH;

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Discover timeless styles",
    title: ["Premium", "Fashion"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Latest trends for you",
    title: ["New", "Arrivals"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Elevate your style",
    title: ["Luxury", "Collection"],
  },
];

const quickActions = [
  { id: "about", label: "ABOUT US" },
  { id: "stores", label: "STORES", icon: { family: "Feather", name: "map-pin", size: 18 } },
  { id: "contact", label: "CONTACT US", icon: { family: "Feather", name: "message-square", size: 18 } },
  { id: "account", label: "MY ACCOUNT", icon: { family: "Ionicons", name: "person-circle-outline", size: 22 } },
  { id: "wishlist", label: "WISHLIST", icon: { family: "Feather", name: "heart", size: 18 } },
  { id: "cart", label: "CART", icon: { family: "Feather", name: "shopping-bag", size: 18 } },
];

const menuLinks = ["NEW IN", "SALES", "PRODUCTS", "COLLECTIONS", "WEDDING", "DEALS"];

const MenuIcon = ({ icon }) => {
  if (!icon) {
    return null;
  }

  if (icon.family === "Ionicons") {
    return <Ionicons name={icon.name} size={icon.size} color={colors.black} />;
  }

  return <Feather name={icon.name} size={icon.size} color={colors.black} />;
};

const HomeScreen = () => {
  const scrollRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const slideCount = useMemo(() => slides.length, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => {
        const nextIndex = (current + 1) % slideCount;
        scrollRef.current?.scrollTo({ x: nextIndex * SLIDE_WIDTH, animated: true });
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [slideCount]);

  const goToSlide = (index) => {
    scrollRef.current?.scrollTo({ x: index * SLIDE_WIDTH, animated: true });
    setActiveSlide(index);
  };

  const handleScrollEnd = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setActiveSlide(nextIndex);
  };

  const handleNext = () => {
    goToSlide((activeSlide + 1) % slideCount);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.fixedHeader}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.logoButton} activeOpacity={0.85}>
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            contentContainerStyle={styles.heroTrack}
          >
            {slides.map((slide) => (
              <ImageBackground
                key={slide.id}
                source={{ uri: slide.image }}
                style={styles.heroSlide}
                imageStyle={styles.heroImage}
              >
                <View style={styles.overlay} />

                <View style={styles.heroContent}>
                  <Text style={styles.heroEyebrow}>{slide.eyebrow}</Text>
                  <Text style={styles.heroTitle}>{slide.title[0]}</Text>
                  <Text style={styles.heroTitle}>{slide.title[1]}</Text>

                  <TouchableOpacity style={styles.shopButton} activeOpacity={0.88}>
                    <Text style={styles.shopButtonText}>Shop Now</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.heroAccent} activeOpacity={0.9}>
            <Feather name="arrow-up-right" size={18} color={colors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.88}>
            <Feather name="chevron-right" size={24} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.dots}>
            {slides.map((slide, index) => (
              <TouchableOpacity
                key={slide.id}
                style={[styles.dot, index === activeSlide && styles.activeDot]}
                onPress={() => goToSlide(index)}
                activeOpacity={0.85}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {menuOpen ? (
        <View style={styles.mobileMenuOverlay}>
          <ScrollView
            style={styles.mobileMenu}
            contentContainerStyle={styles.mobileMenuContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mobileMenuSection}>
              {quickActions.map((item) => (
                <TouchableOpacity key={item.id} style={styles.mobileMenuRow} activeOpacity={0.82}>
                  {item.icon ? (
                    <View style={styles.mobileMenuIconWrap}>
                      <MenuIcon icon={item.icon} />
                    </View>
                  ) : null}
                  <Text style={[styles.mobileMenuLabel, !item.icon && styles.mobileMenuLabelNoIcon]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.mobileMenuSection}>
              {menuLinks.map((item) => (
                <TouchableOpacity key={item} style={styles.mobileMenuRow} activeOpacity={0.82}>
                  <Text style={styles.mobileNavLabel}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.deliveryCard} activeOpacity={0.9}>
              <View style={styles.deliveryIconWrap}>
                <Feather name="truck" size={18} color={colors.white} />
              </View>
              <View>
                <Text style={styles.deliveryTitle}>EXPRESS DELIVERY</Text>
                <Text style={styles.deliverySubtitle}>Upgrade Your Delivery Method</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : null}
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
    lineHeight: 18,
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
    paddingTop: HEADER_HEIGHT,
  },
  mobileMenuOverlay: {
    position: "absolute",
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  mobileMenu: {
    backgroundColor: colors.white,
    flex: 1,
  },
  mobileMenuContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  mobileMenuSection: {
    borderTopWidth: 1,
    borderTopColor: "#efefef",
  },
  mobileMenuRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
  },
  mobileMenuIconWrap: {
    width: 32,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 4,
  },
  mobileMenuLabel: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "400",
  },
  mobileMenuLabelNoIcon: {
    marginLeft: 0,
  },
  mobileNavLabel: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "400",
  },
  deliveryCard: {
    marginTop: 16,
    marginHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.black,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  deliveryIconWrap: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  deliveryTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  deliverySubtitle: {
    color: "#d2a51d",
    fontSize: 11,
    lineHeight: 14,
  },
  heroWrapper: {
    marginTop: -1,
    height: HERO_HEIGHT,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  heroTrack: {
    alignItems: "stretch",
  },
  heroSlide: {
    width: SLIDE_WIDTH,
    height: HERO_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 88,
    paddingBottom: 110,
  },
  heroImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(9, 13, 12, 0.34)",
  },
  heroContent: {
    marginTop: 130,
    zIndex: 2,
  },
  heroEyebrow: {
    color: colors.white,
    fontSize: typography.bodyLarge,
    fontWeight: "500",
    marginBottom: 18,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 58,
    lineHeight: 66,
    fontWeight: "300",
  },
  shopButton: {
    marginTop: 42,
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    paddingHorizontal: 26,
    paddingVertical: 15,
  },
  shopButtonText: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: "700",
  },
  heroAccent: {
    position: "absolute",
    left: 18,
    top: HERO_HEIGHT / 2 + 26,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 167, 38, 0.32)",
    borderWidth: 2,
    borderColor: "#f7b233",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    position: "absolute",
    right: 16,
    top: HERO_HEIGHT / 2 + 34,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    position: "absolute",
    bottom: 28,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  activeDot: {
    backgroundColor: colors.white,
  },
});

export default HomeScreen;
