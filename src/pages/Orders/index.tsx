import OrdersMain from "../../components/Orders/Main";
import PageMeta from "../../components/ui/PageMeta";

const Orders = () => {
     return (
          <div>
               <PageMeta
                    title="Orders - TAPDESIGN Dashboard"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <OrdersMain />
          </div>
     )
}

export default Orders;