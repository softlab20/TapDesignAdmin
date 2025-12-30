import OrdersReport from "../../components/Reports/OrdersReport";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";
import { useTranslation } from "react-i18next";

const OrdersReportPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={t("Orders Report")} />
      <OrdersReport />
    </div>
  );
};

export default OrdersReportPage;
