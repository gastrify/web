import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useDocumentTitle(titleKey: string) {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Gastrify | ${t(titleKey)}`;
  }, [t, titleKey]);
}
