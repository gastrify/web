import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastrify | Notifications",
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
