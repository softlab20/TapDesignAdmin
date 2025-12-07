import PageMeta from "../../components/ui/PageMeta";
import ModeratorsMain from "../../components/Moderators/Main";

const Moderators = () => {
     return (
          <div>
               <PageMeta
                    title="Moderators"
                    description="WithaqVDR - Dashboard for WithaqVDR application"
               />
               <ModeratorsMain />
          </div>
     )
}

export default Moderators;