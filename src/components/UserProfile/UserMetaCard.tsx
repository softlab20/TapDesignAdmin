import { useAuth } from "../../context/auth-and-perm/AuthProvider";
import Avatar from "../ui/avatar/Avatar";

export default function UserMetaCard() {
  const { user } = useAuth();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-16 h-16 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Avatar
                alt="User Avatar"
                name={user?.first_name + " " + user?.last_name}
                size="xxlarge"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 rtl:xl:text-right ltr:xl:text-left">
                {user?.first_name} {user?.last_name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 rtl:xl:text-right ltr:xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
                {/* <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.phone}
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
