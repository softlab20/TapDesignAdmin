import RevenueReport from "../../components/Reports/RevenueReport";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";
import { useTranslation } from "react-i18next";

const RevenueReportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={t("Revenue Report")} />
      <RevenueReport />
    </div>
  );
};

export default RevenueReportPage;
