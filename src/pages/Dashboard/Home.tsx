import PageMeta from "../../components/ui/PageMeta";
import StatCard from "../../components/Dashboard/StatCard";
import ChartCard from "../../components/Dashboard/ChartCard";
import SimpleBarChart from "../../components/Dashboard/SimpleBarChart";
import SimpleLineChart from "../../components/Dashboard/SimpleLineChart";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import TopProducts from "../../components/Dashboard/TopProducts";
import useFetch from "../../hooks/useFetch";
import { useTranslation } from "react-i18next";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiShoppingCart,
  FiTag,
  FiClock,
  FiActivity
} from "react-icons/fi";

interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  total_revenue: number;
  total_products: number;
  total_customers: number;
  active_coupons: number;
  today_orders: number;
  today_revenue: number;
  month_orders: number;
  month_revenue: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total: string;
  status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
}

interface TopProduct {
  id: number;
  title_ar: string;
  title_en: string;
  price: string;
  main_image: string | null;
  orders_count: number;
  total_sold: string | null;
  total_revenue: string | null;
}

interface RevenueChart {
  month: string;
  revenue: number;
}

interface DashboardData {
  stats: DashboardStats;
  recent_orders: RecentOrder[];
  top_products: TopProduct[];
  revenue_chart: RevenueChart[];
}

export default function Home() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Fetch dashboard data
  const { data, isLoading, isError } = useFetch<any>({
    endpoint: "mcp/dashboard",
    queryKey: ["dashboard"],
    select: (response: any) => response?.result?.data as DashboardData,
  });

  const dashboardData = data as DashboardData | undefined;
  const stats = dashboardData?.stats;
  const recentOrders = dashboardData?.recent_orders || [];
  const topProducts = dashboardData?.top_products || [];
  const revenueChart = dashboardData?.revenue_chart || [];

  // Format currency
  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return '0.00 ر.س';
    return `${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
  };

  // Stats configuration
  const statsCards = [
    {
      title: isArabic ? "إجمالي الطلبات" : "Total Orders",
      value: stats?.total_orders || 0,
      icon: <FiShoppingBag className="h-6 w-6" />,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      loading: isLoading
    },
    {
      title: isArabic ? "إجمالي العملاء" : "Total Customers",
      value: stats?.total_customers || 0,
      icon: <FiUsers className="h-6 w-6" />,
      iconBgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      loading: isLoading
    },
    {
      title: isArabic ? "إجمالي الإيرادات" : "Total Revenue",
      value: formatCurrency(stats?.total_revenue),
      icon: <FiDollarSign className="h-6 w-6" />,
      iconBgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      loading: isLoading
    },
    {
      title: isArabic ? "إجمالي المنتجات" : "Total Products",
      value: stats?.total_products || 0,
      icon: <FiPackage className="h-6 w-6" />,
      iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      loading: isLoading
    },
    {
      title: isArabic ? "الطلبات المعلقة" : "Pending Orders",
      value: stats?.pending_orders || 0,
      icon: <FiClock className="h-6 w-6" />,
      iconBgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      loading: isLoading
    },
    {
      title: isArabic ? "الطلبات قيد المعالجة" : "Processing Orders",
      value: stats?.processing_orders || 0,
      icon: <FiActivity className="h-6 w-6" />,
      iconBgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      loading: isLoading
    },
    {
      title: isArabic ? "الكوبونات النشطة" : "Active Coupons",
      value: stats?.active_coupons || 0,
      icon: <FiTag className="h-6 w-6" />,
      iconBgColor: "bg-pink-100 dark:bg-pink-900/30",
      iconColor: "text-pink-600 dark:text-pink-400",
      loading: isLoading
    },
    {
      title: isArabic ? "طلبات اليوم" : "Today's Orders",
      value: stats?.today_orders || 0,
      icon: <FiShoppingCart className="h-6 w-6" />,
      iconBgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      loading: isLoading
    }
  ];

  // Today's stats
  const todayStats = [
    {
      title: isArabic ? "طلبات اليوم" : "Today's Orders",
      value: stats?.today_orders || 0,
      icon: <FiShoppingCart className="h-6 w-6" />,
      iconBgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      loading: isLoading
    },
    {
      title: isArabic ? "إيرادات اليوم" : "Today's Revenue",
      value: formatCurrency(stats?.today_revenue),
      icon: <FiDollarSign className="h-6 w-6" />,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      loading: isLoading
    },
    {
      title: isArabic ? "طلبات الشهر" : "Month Orders",
      value: stats?.month_orders || 0,
      icon: <FiTrendingUp className="h-6 w-6" />,
      iconBgColor: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
      loading: isLoading
    },
    {
      title: isArabic ? "إيرادات الشهر" : "Month Revenue",
      value: formatCurrency(stats?.month_revenue),
      icon: <FiDollarSign className="h-6 w-6" />,
      iconBgColor: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
      loading: isLoading
    }
  ];

  // Format revenue chart data for line chart
  const revenueChartData = revenueChart.map((item) => ({
    label: item.month,
    value: item.revenue
  }));

  // Convert recent orders to activities
  const recentActivities = recentOrders.slice(0, 5).map((order) => ({
    id: order.id,
    icon: <FiShoppingCart className="h-5 w-5 text-blue-600" />,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    title: `${isArabic ? 'طلب' : 'Order'} #${order.id}`,
    description: `${order?.user?.first_name} ${order?.user?.last_name} - ${formatCurrency(order.total)}`,
    time: new Date(order.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')
  }));

  // Sample data for category chart (can be extended with real data)
  const categoryData = topProducts.slice(0, 5).map((product, index) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-gray-500'];
    return {
      label: isArabic ? product.title_ar : product.title_en,
      value: Number(product.total_revenue) || 0,
      color: colors[index % colors.length]
    };
  });

  return (
    <>
      <PageMeta
        title="TAPDESIGN - Dashboard"
        description="TAPDESIGN - Dashboard for TAPDESIGN application"
      />

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            {isArabic ? 'مرحباً بك مجدداً' : 'Welcome Back'}! 👋
          </h1>
          <p className="text-blue-100">
            {isArabic ? 'هنا ما يحدث في متجرك اليوم' : "Here's what's happening with your store today"}
          </p>
        </div>

        {/* Main Stats Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'إحصائيات عامة' : 'General Statistics'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsCards.slice(0, 4).map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Orders & Coupons Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'الطلبات والكوبونات' : 'Orders & Coupons'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsCards.slice(4, 8).map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Today & Month Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isArabic ? 'إحصائيات اليوم والشهر' : "Today's & Month Statistics"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {todayStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        {revenueChartData.length > 0 && (
          <ChartCard
            title={isArabic ? 'نظرة عامة على الإيرادات' : 'Revenue Overview'}
            subtitle={isArabic ? 'اتجاه الإيرادات الشهرية' : 'Monthly revenue trend'}
          >
            <SimpleLineChart data={revenueChartData} height={300} />
          </ChartCard>
        )}

        {/* Top Products by Revenue - Full Width */}
        {categoryData.length > 0 && (
          <ChartCard
            title={isArabic ? 'أعلى المنتجات' : 'Top Products'}
            subtitle={isArabic ? 'المبيعات حسب المنتج' : 'Revenue by product'}
          >
            <SimpleBarChart data={categoryData} height={300} />
          </ChartCard>
        )}

        {/* Recent Activity & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Top Products */}
          <ChartCard
            title={isArabic ? 'أفضل المنتجات مبيعاً' : 'Top Selling Products'}
            subtitle={isArabic ? 'المنتجات الأكثر مبيعاً' : 'Best performing products'}
          >
            <TopProducts products={topProducts} loading={isLoading} />
          </ChartCard>

          {/* Recent Orders */}
          {recentActivities.length > 0 ? (
            <ChartCard
              title={isArabic ? 'الطلبات الأخيرة' : 'Recent Orders'}
              subtitle={isArabic ? 'آخر التحديثات' : 'Latest updates'}
            >
              <RecentActivity activities={recentActivities} />
            </ChartCard>
          ) : (
            <ChartCard
              title={isArabic ? 'الطلبات الأخيرة' : 'Recent Orders'}
              subtitle={isArabic ? 'آخر التحديثات' : 'Latest updates'}
            >
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{isArabic ? 'لا توجد طلبات حديثة' : 'No recent orders'}</p>
              </div>
            </ChartCard>
          )}
        </div>
        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              {isArabic ? 'حدث خطأ أثناء تحميل بيانات لوحة التحكم' : 'Error loading dashboard data'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
