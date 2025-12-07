import { t } from "i18next";
import * as Yup from "yup";

export interface MainDataProps {
  row: any;
  setModalOpen: (value: boolean) => void;
  refetch: () => void;
  setData?: (value: any) => void;
}

export const MainDataValidation = Yup.object().shape({
  title_ar: Yup.string().required(t("Arabic title is required")),
  title_en: Yup.string().required(t("English title is required")),
  image: Yup.string().optional(),
});
