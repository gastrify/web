import { useTranslation } from "react-i18next";

export const useAppointmentTitle = () => {
  const { t } = useTranslation("appoinments");

  const getTitle = (title: string) => {
    switch (title) {
      case "available":
        return t("create.available");
      case "booked":
        return t("create.booked");
      default:
        return title;
    }
  };

  return { getTitle };
};
