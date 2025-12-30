import PageMeta from "../../components/ui/PageMeta";
import UsersMain from "../../components/Users/Main";

const Users = () => {
     return (
          <div>
               <PageMeta
                    title="Users - TAPDESIGN Dashboard"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <UsersMain />
          </div>
     )
}

export default Users;