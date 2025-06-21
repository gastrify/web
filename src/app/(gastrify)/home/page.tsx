"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";

export default function HomePage() {
  const { t } = useTranslation("app");

  useEffect(() => {
    document.title = `Gastrify | ${t("page.homeTitle")}`;
  }, [t]);

  // Note: This is a server action, but we're in a client component
  // In a real implementation, this would be handled differently
  // For now, we'll keep it as is since it's just for demonstration

  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>{t("page.homeTitle")}</TypographyH1>
      <TypographyP>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
        corrupti numquam beatae optio eum necessitatibus iusto hic tempore
        dolores obcaecati magni fugit nisi nostrum est pariatur. Repudiandae
        suscipit sunt nesciunt? Lorem ipsum dolor sit amet consectetur,
        adipisicing elit. Architecto, repellendus non aspernatur tempora sed
        sint aliquam excepturi facilis. Placeat eum omnis dolores dignissimos
        recusandae praesentium eius vero, esse laborum labore! Ad, inventore
        optio tempore dolorem dolorum dolore praesentium modi rerum blanditiis,
        cumque voluptatem cum ipsa mollitia ratione pariatur culpa, ducimus
        possimus quasi veritatis velit aspernatur reprehenderit.
      </TypographyP>
    </div>
  );
}
