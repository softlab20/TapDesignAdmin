import CustomersReport from "../../components/Reports/CustomersReport";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";
import { useTranslation } from "react-i18next";

const CustomersReportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={t("Customers Report")} />
      <CustomersReport />
    </div>
  );
};

export default CustomersReportPage;
