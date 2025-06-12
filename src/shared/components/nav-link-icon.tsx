"use client";

import { useLinkStatus } from "next/link";
import { LoaderIcon } from "lucide-react";

export function NavLinkIcon({ icon }: { icon: React.ReactNode }) {
  const { pending } = useLinkStatus();

  return pending ? (
    <LoaderIcon role="status" aria-label="Loading" className="animate-spin" />
  ) : (
    icon
  );
}
