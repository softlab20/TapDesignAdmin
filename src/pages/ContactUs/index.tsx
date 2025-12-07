import ContactUsMain from "../../components/ContactUs/Main";
import PageMeta from "../../components/ui/PageMeta";

const ContactUs = () => {
     return (
          <div>
               <PageMeta
                    title="Contact Us - TAPDESIGN Dashboard"
                    description="TAPDESIGN - Dashboard for TAPDESIGN application"
               />
               <ContactUsMain />
          </div>
     )
}

export default ContactUs;