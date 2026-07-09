export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
  image: string;
  secondaryImage: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  stock: number;
  colorOptions: { name: string; hex: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Review {
  id: string;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    color?: string;
  }[];
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentStatus: "paid" | "pending";
  orderDate: string;
}

export interface APILog {
  id: string;
  timestamp: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  status: number;
  payload?: any;
  response: any;
}
