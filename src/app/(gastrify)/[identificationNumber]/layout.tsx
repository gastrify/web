import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastrify | Profile",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
