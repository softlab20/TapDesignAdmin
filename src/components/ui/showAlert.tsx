import { t } from "i18next";
import Swal, { SweetAlertIcon } from "sweetalert2";

function showAlert(
  tit?: any,
  text_inpL?: any,
  inp?: boolean,
  confirm_btn_txt?: any,
  show_cancel?: boolean,
  type?: SweetAlertIcon,
  action?: () => void
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!inp) {
      Swal.fire({
        icon: type,
        title: tit,
        text: text_inpL,
        showCancelButton: show_cancel,
        confirmButtonText: confirm_btn_txt || `${t("Confirm")}`,
        cancelButtonText: `${t("Cancel")}`,
        padding: "2em",
        customClass: {
          popup: "sweet-alerts w-[600px] z-[9999]",
          title: "sweet-alerts-title",
          confirmButton: "sweet-alerts-confirm",
          cancelButton: "sweet-alerts-cancel",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value || "confirmed");
          if (action) {
            action();
          }
        } else {
          resolve(null);
        }
      });
    } else {
      Swal.fire({
        title: tit,
        input: "textarea",
        inputLabel: text_inpL,
        confirmButtonText: confirm_btn_txt || `${t("Confirm")}`,
        inputPlaceholder: "Enter your new event",
        padding: "2em",
        customClass: {
          popup: "sweet-alerts w-[600px] z-[9999]",
          title: "sweet-alerts-title",
          confirmButton: "sweet-alerts-confirm",
          input: "sweet-alerts-input",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value || null);
        } else {
          resolve(null);
        }
      });
    }
  });
}

export default showAlert;