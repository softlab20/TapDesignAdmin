import * as Yup from "yup";

export interface MainDataProps {
  row: any;
  setModalOpen: (value: boolean) => void;
  refetch: () => void;
  setData?: (value: any) => void;
}

export const MainDataValidation = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role_id: Yup.mixed().required("Role is required"),
  is_active: Yup.boolean().required(),
  password: Yup.string().when([], {
    is: () => true,
    then: Yup.string(),
  }),
  password_confirmation: Yup.string().oneOf([Yup.ref("password"), ""], "Passwords must match"),
});
