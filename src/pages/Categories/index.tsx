import CategoriesMain from "../../components/Categories/Main";
import PageMeta from "../../components/ui/PageMeta";

const Categories = () => {
     return (
          <div>
               <PageMeta
                    title="Categories"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <CategoriesMain />
          </div>
     )
}

export default Categories;