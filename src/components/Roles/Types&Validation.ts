import * as Yup from "yup";

export interface MainDataProps {
  row: any;
  setModalOpen: (value: boolean) => void;
  refetch: () => void;
  setData?: (value: any) => void;
}

export const MainDataValidation = Yup.object().shape({
  // name: Yup.string().required("Name is required"),
  // permissions: Yup.array().required("Permissions are required"),
});
