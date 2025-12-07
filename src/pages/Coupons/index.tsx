import CouponsMain from "../../components/Coupons/Main";
import PageMeta from "../../components/ui/PageMeta";

const Coupons = () => {
     return (
          <div>
               <PageMeta
                    title="Coupons - TAPDESIGN Dashboard"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <CouponsMain />
          </div>
     )
}

export default Coupons;