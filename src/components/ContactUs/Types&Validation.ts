import * as Yup from "yup";

export interface ContactItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
}

// No form for ContactUs list; keep placeholder schema if needed later
export const MainDataValidation = Yup.object().shape({});
