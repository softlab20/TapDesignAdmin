import { useTranslation } from 'react-i18next';
import { MdOutlineLanguage } from "react-icons/md";

const LanguageToggleButton = () => {
     const { i18n } = useTranslation();

     const toggleLanguage = () => {
          const newLang = i18n.language === 'en' ? 'ar' : 'en';
          i18n.changeLanguage(newLang);
          localStorage.setItem('i18nextLng', newLang);
          document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
          document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
     };

     return (
          <button
               onClick={toggleLanguage}
               className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
               title={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
               <MdOutlineLanguage className="text-xl" />
               <span className="sr-only">
                    {i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
               </span>
          </button>
     );
};

export default LanguageToggleButton;