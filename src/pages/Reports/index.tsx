import { useState } from "react";
import { useTranslation } from "react-i18next";
import SalesReport from "../../components/Reports/SalesReport";
import OrdersReport from "../../components/Reports/OrdersReport";
import ProductsReport from "../../components/Reports/ProductsReport";
import CustomersReport from "../../components/Reports/CustomersReport";
import RevenueReport from "../../components/Reports/RevenueReport";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";

type ReportTab = "sales" | "orders" | "products" | "customers" | "revenue";

const Reports = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ReportTab>("sales");

  const tabs: { key: ReportTab; label: string }[] = [
    { key: "sales", label: t("Sales Report") },
    { key: "orders", label: t("Orders Report") },
    { key: "products", label: t("Products Report") },
    { key: "customers", label: t("Customers Report") },
    { key: "revenue", label: t("Revenue Report") },
  ];

  const renderActiveReport = () => {
    switch (activeTab) {
      case "sales":
        return <SalesReport />;
      case "orders":
        return <OrdersReport />;
      case "products":
        return <ProductsReport />;
      case "customers":
        return <CustomersReport />;
      case "revenue":
        return <RevenueReport />;
      default:
        return <SalesReport />;
    }
  };

  return (
    <div className="w-full">
      <PageBreadcrumb pageTitle={t("Reports")} />

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Report Content */}
      <div>{renderActiveReport()}</div>
    </div>
  );
};

export default Reports;
