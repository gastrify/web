import { Skeleton } from "@/shared/components/ui/skeleton";

import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";

export default function Loading() {
  return (
    <div className="space-y-10">
      <SettingsPageHeader
        title="Account"
        description="Update your account settings."
      />

      <form className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-start gap-2">
            <label className="text-sm font-medium">Full Name</label>
            <Skeleton className="h-8 w-48" />
          </div>
          <p className="text-muted-foreground text-sm">
            This is your public display name. It can be your real name or a
            pseudonym.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-start gap-2">
            <label className="text-sm font-medium">Identification Number</label>
            <Skeleton className="h-8 w-64" />
          </div>
          <p className="text-muted-foreground text-sm">
            This is your identification number. It will not be publicly visible.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-start gap-2">
            <label className="text-sm font-medium">Email</label>
            <Skeleton className="h-8 w-48" />
          </div>
          <p className="text-muted-foreground text-sm">
            This is the email address we will use to contact you. It will not be
            publicly visible.
          </p>
        </div>
      </form>
    </div>
  );
}
