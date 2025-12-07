import CustomersMain from "../../components/Customers/Main";
import PageMeta from "../../components/ui/PageMeta";

const Customers = () => {
     return (
          <div>
               <PageMeta
                    title="Customers - TAPDESIGN Dashboard"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <CustomersMain />
          </div>
     )
}

export default Customers;