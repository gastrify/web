import { useTranslation } from "react-i18next";

export const useGetTranslatedTitle = () => {
  const { t } = useTranslation("appointments");

  return (title: string) => {
    if (title === "booked") {
      return t("create.appointmentStatus.booked");
    }
    if (title === "available") {
      return t("create.appointmentStatus.available");
    }
    return title;
  };
};
