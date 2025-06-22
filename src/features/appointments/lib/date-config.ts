import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export function useDateConfig() {
  const { i18n } = useTranslation();

  const locale = i18n.language === "es" ? es : enUS;

  return {
    locale,
    weekStartsOn: 1 as const, // Monday
  };
}

// Configuración estática para uso en componentes que no pueden usar hooks
export function getDateConfig(language: string) {
  const locale = language === "es" ? es : enUS;

  return {
    locale,
    weekStartsOn: 1 as const, // Monday
  };
}
