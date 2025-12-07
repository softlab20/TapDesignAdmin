import PageMeta from "../../components/ui/PageMeta";
import RolesMain from "../../components/Roles/Main";

const Roles = () => {
     return (
          <div>
               <PageMeta
                    title="Roles & Permissions"
                    description="WithaqVDR - Dashboard for WithaqVDR application"
               />
               <RolesMain />
          </div>
     )
}

export default Roles;