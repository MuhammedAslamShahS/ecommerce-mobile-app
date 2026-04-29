import { Platform } from "react-native";

const resolveApiBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001";
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:5001`;
  }

  return "http://localhost:5001";
};

const API_BASE_URL = resolveApiBaseUrl();

const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  return {
    id: product.id,
    title: product.title,
    description: product.description ?? null,
    price: Number(product.price || 0),
    stock: Number(product.stock || 0),
    brand: product.brand ?? null,
    category: product.category ?? null,
    section: product.section || "",
    image: product.imageUrl || "",
    imageUrl: product.imageUrl || "",
    isActive: Boolean(product.isActive),
    createdBy: product.createdBy ?? null,
    createdAt: product.createdAt ?? null,
  };
};

const getAllProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Unable to fetch products");
  }

  const payload = await response.json();
  const products = payload?.data?.products || [];

  return products.map(normalizeProduct).filter(Boolean);
};

const getProductById = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`);

  if (!response.ok) {
    throw new Error("Unable to fetch product details");
  }

  const payload = await response.json();
  return normalizeProduct(payload?.data?.product);
};

export { getAllProducts, getProductById };
