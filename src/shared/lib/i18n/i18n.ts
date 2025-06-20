import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import AuthEs from "../../../../public/locales/es/auth.json";
import AuthEn from "../../../../public/locales/en/auth.json";
import SettingsEs from "../../../../public/locales/es/settingsProfile.json";
import SettingsEn from "../../../../public/locales/en/settingsProfile.json";
import AppEn from "../../../../public/locales/en/app.json";
import AppEs from "../../../../public/locales/es/app.json";
import AppointmentsEs from "../../../../public/locales/es/appointments.json";
import AppointmentsEn from "../../../../public/locales/en/appointments.json";

const lng =
  typeof window !== "undefined"
    ? window.localStorage.getItem("language") ||
      navigator.language.split("-")[0] ||
      "es"
    : "es";

i18n.use(initReactI18next).init({
  resources: {
    es: {
      auth: AuthEs,
      settingsProfile: SettingsEs,
      app: AppEs,
      appointments: AppointmentsEs,
    },
    en: {
      auth: AuthEn,
      settingsProfile: SettingsEn,
      app: AppEn,
      appointments: AppointmentsEn,
    },
  },
  lng,
  fallbackLng: "es",
  ns: ["auth", "settingsProfile", "app", "appointments"],
  defaultNS: "auth",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
