import SalesReport from "../../components/Reports/SalesReport";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";
import { useTranslation } from "react-i18next";

const SalesReportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={t("Sales Report")} />
      <SalesReport />
    </div>
  );
};

export default SalesReportPage;
