import * as Yup from "yup";

export interface MainDataProps {
  row: any;
  setModalOpen: (value: boolean) => void;
  refetch: () => void;
  setData?: (value: any) => void;
}

export interface ProductFormValues {
  title_ar: string;
  title_en: string;
  features_ar: string[];
  features_en: string[];
  description: string;
  additional_info: string;
  shipping_info: string;
  in_stock: boolean;
  category_id: number | string;
  price: number | string;
  sale_amount?: number | string;
  personilze: boolean;
  personilze_price?: number | string;
  personilze_details: {
    options: string[];
    max_characters?: number | string;
  };
  colors: string[];
  main_image: string;
  images: string[];
}

export const MainDataValidation = Yup.object({
  title_ar: Yup.string().required("Arabic title is required"),
  title_en: Yup.string().required("English title is required"),
  description: Yup.string().required("Description is required"),
  additional_info: Yup.string().nullable(),
  shipping_info: Yup.string().nullable(),
  in_stock: Yup.boolean().required(),
  category_id: Yup.mixed().required("Category is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be positive"),

  sale_amount: Yup.number()
    .typeError("Sale amount must be a number")
    .nullable()
    .min(0, "Must be positive")
    .test(
      "lte-price",
      "Sale amount must be less than or equal to price",
      function (val) {
        const price = this.parent.price;
        if (val == null || val === "") return true;
        const v = Number(val);
        const p = Number(price);
        if (isNaN(v) || isNaN(p)) return true;
        return v <= p;
      }
    ),

  personilze: Yup.boolean().required(),

  // ✅ FIXED HERE
  personilze_price: Yup.number()
    .typeError("Personalize price must be a number")
    .when("personilze", (personilze, schema) => {
      return personilze
        ? schema.required("Personalize price is required").positive("Must be positive")
        : schema.notRequired().nullable();
    }),

  personilze_details: Yup.object({
    options: Yup.array().of(Yup.string().trim()).default([]),
    max_characters: Yup.number()
      .typeError("Must be a number")
      .integer("Must be integer")
      .min(0, "Must be >= 0")
      .nullable(),
  }),

  colors: Yup.array().of(Yup.string().trim()).default([]),
  main_image: Yup.string().nullable(),
  images: Yup.array().of(Yup.string()).default([]),
});
