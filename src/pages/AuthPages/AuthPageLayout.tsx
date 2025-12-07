import React, { useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import GridShape from "../../components/ui/GridShape";
import ThemeTogglerTwo from "../../components/ui/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <div className="px-4 py-2 rounded-2xl mb-4 bg-amber-50 text-center">
                <Link to="/" className="block">
                  <img
                    width={231}
                    height={48}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
              </div>
              <p className="text-center text-gray-400 dark:text-white/60">
                {t("Welcome to TAPDESIGN")}
              </p>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 ltr:left-6 rtl:right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
