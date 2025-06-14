import type { Metadata } from "next";

import { ThemeSwitch } from "@/shared/components/theme-switch";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Gastrify",
  description: "Fuck it, we ball",
};

export default function Home() {
  return redirect("/home");
  return (
    <main>
      <ThemeSwitch />
    </main>
  );
}
