export interface MainDataProps {
  row: any;
  setModalOpen: (value: boolean) => void;
  refetch: () => void;
  setData?: (value: any) => void;
}

// Customer Interfaces
export interface Address {
  id: number;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: number;
    discount_price: number;
    price_after_discount: number;
    description: string;
    preparation_time: string;
    image: string;
    web_image: string;
    type: string;
    category_id: number;
    category: {
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
    };
    created_at: string;
    updated_at: string;
  } | null;
  count: number;
  price: string;
}

export interface Order {
  id: number;
  user_id: number;
  address_id: number;
  status: string;
  subtotal: string;
  discount_amount: string;
  total: string;
  coupon_id: number | null;
  coupon: {
    id: number;
    code: string;
    type: string;
    value: string;
  } | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  is_active: number;
  orders: Order[];
  addresses: Address[];
  created_at: string;
  updated_at: string | null;
}

export interface ProductFormValues {
  name: string;
  price: number | string;
  discount_price: number | string;
  description: string;
  category_id: number | string;
  preparation_time: string;
  type: "sandTAPDESIGN" | "box" | "additionals" | "";
  image: string | File;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  discount_price: number;
  price_after_discount: number;
  description: string;
  preparation_time: string;
  image: string;
  type: "sandTAPDESIGN" | "box" | "additionals";
  category: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  } | null;
  web_image: string;
  created_at: string;
  updated_at: string;
}

