// Sales Report Types
export interface SalesReportData {
  total_sales: number;
  total_revenue: number;
  average_order_value: number;
  total_discount: number;
  by_status: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
}

export interface SalesReportResponse {
  status: string;
  result: {
    data: SalesReportData;
  };
  message: string;
}

// Orders Report Types
export interface OrdersReportData {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  by_payment_status: Array<{
    payment_status: string;
    count: number;
  }>;
}

export interface OrdersReportResponse {
  status: string;
  result: {
    data: OrdersReportData;
  };
  message: string;
}

// Products Report Types
export interface TopSellingProduct {
  id: number;
  title_ar: string;
  title_en: string;
  price: string;
  main_image: string | null;
  orders_count: number;
  total_sold: string | null;
  total_revenue: string | null;
}

export interface ProductsReportData {
  total_products: number;
  in_stock: number;
  out_of_stock: number;
  top_selling: TopSellingProduct[];
}

export interface ProductsReportResponse {
  status: string;
  result: {
    data: ProductsReportData;
  };
  message: string;
}

// Customers Report Types
export interface TopCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  orders_count: number;
  total_spent: string;
}

export interface CustomersReportData {
  total_customers: number;
  active_customers: number;
  new_this_month: number;
  top_customers: TopCustomer[];
}

export interface CustomersReportResponse {
  status: string;
  result: {
    data: CustomersReportData;
  };
  message: string;
}

// Revenue Report Types
export interface RevenueDataPoint {
  date: string;
  orders_count: number;
  revenue: string;
}

export interface RevenueReportResponse {
  status: string;
  result: {
    data: RevenueDataPoint[];
  };
  message: string;
}
