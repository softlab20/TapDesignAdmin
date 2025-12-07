import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ChevronDownIcon,
  GridIcon
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { TbGridDots } from "react-icons/tb";
import { MdSecurity, MdSupportAgent } from "react-icons/md";
import { BiSolidBasket, BiSolidCoupon } from "react-icons/bi";
import { SlBasket } from "react-icons/sl";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <SlBasket />,
    name: "Orders",
    path: "/orders",
  },
  {
    icon: <TbGridDots />,
    name: "Categories",
    path: "/categories",
  },

  {
    icon: <BiSolidBasket />,
    name: "Products",
    path: "/products",
  },

  {
    icon: <BiSolidCoupon />,
    name: "Coupons",
    path: "/coupons",
  },

  // contact us
  {
    icon: <MdSupportAgent />,
    name: "Contact Us",
    path: "/contact-us",
  },

  {
    name: "Security",
    icon: <MdSecurity />,
    subItems: [
      { name: "Moderators", path: "/moderators", pro: false },
      { name: "Role & Permissions", path: "/role", pro: false },
    ],
  },

  // {
  //   icon: <FaUser />,
  //   name: "Customers",
  //   path: "/customers",
  // },
  // {
  //   icon: <MdSupportAgent />,
  //   name: "Support",
  //   path: "/support",
  // },
  // {
  //   icon: <MdDeliveryDining />,
  //   name: "Delivery Price",
  //   path: "/delivery-price",
  // },
  // {
  //   icon: <PiFlagBannerFill />,
  //   name: "Banners",
  //   path: "/banners",
  // }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { i18n, t } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main",
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === "main" &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: "main", index };
    });
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4" dir="ltr">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group flex items-center w-full ${openSubmenu?.type === "main" && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : isArabic
                    ? "lg:flex-row-reverse lg:justify-end"
                    : "lg:justify-start"
                }`}
            >
              <span
                className={`menu-item-icon-size ${openSubmenu?.type === "main" && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  } ${isArabic ? "ml-2" : "mr-2"}`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text flex-1 text-right">
                  {t(nav.name)}
                </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`w-5 h-5 transition-transform duration-200 ${openSubmenu?.type === "main" && openSubmenu?.index === index
                    ? "rotate-180 text-brand-500"
                    : ""
                    } ${isArabic ? "mr-2" : "ml-2"}`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group flex items-center w-full ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  } ${!isExpanded && !isHovered
                    ? "lg:justify-center"
                    : isArabic
                      ? "lg:flex-row-reverse lg:justify-end"
                      : "lg:justify-start"
                  }`}
              >
                <span
                  className={`menu-item-icon-size ${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    } ${isArabic ? "ml-2" : "mr-2"}`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex-1 text-right">
                    {t(nav.name)}
                  </span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === "main" && openSubmenu?.index === index
                    ? `${subMenuHeight[`main-${index}`]}px`
                    : "0px",
              }}
            >
              <ul
                className={`mt-2 space-y-1 ${isArabic ? "mr-9 text-right" : "ml-9 text-left"
                  }`}
              >
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item flex items-center w-full ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        } ${isArabic ? "flex-row-reverse" : ""}`}
                    >
                      <span className="flex-1">{t(subItem.name)}</span>
                      <span
                        className={`flex items-center gap-1 ${isArabic ? "mr-2" : "ml-2"
                          }`}
                      >
                        {subItem.new && (
                          <span
                            className={`${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            {t("new")}
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                          >
                            {t("pro")}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 
        ${isArabic
          ? "right-0 border-r-0 border-l"
          : "left-0 border-l-0 border-r"
        }
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen
          ? "translate-x-0"
          : isArabic
            ? "translate-x-full"
            : "-translate-x-full"
        }
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`pt-5 pb-7 flex`}>
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div>
              <img
                className="dark:hidden"
                src="/images/logo/auth-logo.svg"
                alt="Logo"
                width={180}
                height={55}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/auth-logo.svg"
                alt="Logo"
                width={180}
                height={55}
              />
            </div>
          ) : (
            <img
              src="/images/logo/auth-logo.svg"
              alt="Logo"
              width={62}
              height={62}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">{renderMenuItems(navItems)}</nav>
      </div>
    </aside>
  );
};

export default AppSidebar;