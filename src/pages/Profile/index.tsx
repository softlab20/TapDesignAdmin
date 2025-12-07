import { useTranslation } from "react-i18next";
import PageMeta from "../../components/ui/PageMeta";
import PageBreadcrumb from "../../components/ui/PageBreadCrumb";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import ChangePasswordCard from "../../components/UserProfile/ChangePasswordCard";
import { useModal } from "../../hooks/useModal";

export default function UserProfiles() {
  const { t } = useTranslation();
  const { isOpen: isChangePasswordModalOpen, openModal: openChangePasswordModal, closeModal: ChangePasswordClose } = useModal();

  return (
    <>
      <PageMeta
        title="TAPDESIGN - Profile"
        description="This is Profile page for TAPDESIGN"
      />
      <PageBreadcrumb pageTitle={t("Profile")} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {t('Profile Information')}
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard
            openChangePasswordModal={openChangePasswordModal}
          />
          <ChangePasswordCard
            closeModal={ChangePasswordClose}
            isOpen={isChangePasswordModalOpen}
          />
        </div>
      </div>
    </>
  );
}
