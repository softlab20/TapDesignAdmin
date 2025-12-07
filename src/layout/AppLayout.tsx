import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="min-h-screen xl:flex">
      <div className={`${isArabic ? "order-1" : "order-0"}`}>
        <AppSidebar />
        <Backdrop />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isArabic
            ? isExpanded || isHovered
              ? "lg:mr-[290px]"
              : "lg:mr-[90px]"
            : isExpanded || isHovered
              ? "lg:ml-[290px]"
              : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0 mr-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;