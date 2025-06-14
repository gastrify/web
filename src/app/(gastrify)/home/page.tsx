import type { Metadata } from "next";

import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { getUser } from "@/shared/actions/get-user";

export const metadata: Metadata = {
  title: "Gastrify | Home",
};

export default async function HomePage() {
  await getUser({
    id: "123",
  });

  return (
    <div className="flex flex-col gap-6">
      <TypographyH1>Home</TypographyH1>
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
