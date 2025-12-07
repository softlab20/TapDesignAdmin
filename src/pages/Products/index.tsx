import ProductsMain from "../../components/Products/Main";
import PageMeta from "../../components/ui/PageMeta";

const Products = () => {
     return (
          <div>
               <PageMeta
                    title="Products - TAPDESIGN Dashboard"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <ProductsMain />
          </div>
     )
}

export default Products;