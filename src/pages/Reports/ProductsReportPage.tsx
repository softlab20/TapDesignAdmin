import ProductsReport from "../../components/Reports/ProductsReport";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";
import { useTranslation } from "react-i18next";

const ProductsReportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={t("Products Report")} />
      <ProductsReport />
    </div>
  );
};

export default ProductsReportPage;
