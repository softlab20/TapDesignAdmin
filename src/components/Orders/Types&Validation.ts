export interface PersonalizationDetails {
    text?: string;
    numbers?: string;
    emoji?: string;
}

export interface Product {
    id: number;
    title_ar: string;
    title_en: string;
    main_image: string | null;
}

export interface OrderItem {
    id: number;
    product_id: number;
    product: Product;
    product_title_ar: string;
    product_title_en: string;
    product_image: string | null;
    quantity: number;
    unit_price: string;
    total_price: string;
    is_personalized: boolean;
    personalization_price: string;
    personalization_details: PersonalizationDetails | null;
    selected_color: string | null;
}

export interface User {
    id: number;
    name: string | null;
    email: string;
}

export interface Order {
    id: number;
    user_id: number;
    user: User;
    address_id: number;
    address: any | null;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    subtotal: string;
    discount_amount: string;
    total: string;
    payment_status: 'pending' | 'paid' | 'failed';
    notes: string | null;
    coupon: any | null;
    items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrdersResponse {
    status: string;
    result: {
        data: Order[];
        links: {
            first: string;
            last: string;
            prev: string | null;
            next: string | null;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
    message: string;
}

// Form validation and types
import * as Yup from "yup";

export interface OrderItemFormValues {
    product_id: string;
    quantity: number;
}

export interface OrderFormValues {
    user_id: string;
    address_id: string;
    items: OrderItemFormValues[];
    coupon_code?: string;
}

export const OrderFormValidation = Yup.object().shape({
    user_id: Yup.string().required("Customer is required"),
    address_id: Yup.string().required("Address ID is required"),
    items: Yup.array()
        .of(
            Yup.object().shape({
                product_id: Yup.string().required("Product is required"),
                quantity: Yup.number()
                    .min(1, "Quantity must be at least 1")
                    .required("Quantity is required"),
            })
        )
        .min(1, "At least one item is required"),
    coupon_code: Yup.string().optional(),
});

