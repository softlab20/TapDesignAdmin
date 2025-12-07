import * as Yup from "yup";

export interface MainDataProps {
  row: any;
  setModalOpen: (value: boolean) => void;
  refetch: () => void;
  setData?: (value: any) => void;
}

export interface CouponFormValues {
  code: string;
  type: "fixed" | "percentage" | "";
  value: number | string;
  count: number | string;
  from_date: string;
  to_date: string;
}

export interface Coupon {
  id: number;
  code: string;
  type: "fixed" | "percentage";
  value: string;
  count: number;
  from_date: string;
  to_date: string;
  created_at: string;
}

export const MainDataValidation = Yup.object().shape({
  code: Yup.string().required("Coupon code is required"),
  type: Yup.string()
    .required("Type is required")
    .oneOf(["fixed", "percentage"], "Invalid type"),
  value: Yup.number()
    .required("Value is required")
    .positive("Value must be positive"),
  count: Yup.number()
    .required("Count is required")
    .positive("Count must be positive")
    .integer("Count must be an integer"),
  from_date: Yup.string().required("From date is required"),
  to_date: Yup.string().required("To date is required"),
});
