import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Cookies from "js-cookie";
import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Dashboard/Home";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import UserProfiles from "./pages/Profile";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Coupons from "./pages/Coupons";
import ContactUs from "./pages/ContactUs";
import Moderators from "./pages/Moderators";
import Roles from "./pages/Roles";
import Users from "./pages/Users";
import SalesReportPage from "./pages/Reports/SalesReportPage";
import OrdersReportPage from "./pages/Reports/OrdersReportPage";
import ProductsReportPage from "./pages/Reports/ProductsReportPage";
import CustomersReportPage from "./pages/Reports/CustomersReportPage";
import RevenueReportPage from "./pages/Reports/RevenueReportPage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = localStorage.getItem("user");
  const token = Cookies.get("token");

  if (!user) {
    localStorage.removeItem("user");
    Cookies.remove("token");
    return <Navigate to="/signin" />;
  } else if (!token) {
    localStorage.removeItem("user");
    Cookies.remove("token");
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />Profile
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/moderators" element={<Moderators />} />
            <Route path="/role" element={<Roles />} />
            <Route path="/products" element={<Products />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            
            {/* Reports Routes */}
            <Route path="/reports/sales" element={<SalesReportPage />} />
            <Route path="/reports/orders" element={<OrdersReportPage />} />
            <Route path="/reports/products" element={<ProductsReportPage />} />
            <Route path="/reports/customers" element={<CustomersReportPage />} />
            <Route path="/reports/revenue" element={<RevenueReportPage />} />

            {/*
            <Route path="/customers" element={<Customers />} />
            */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}