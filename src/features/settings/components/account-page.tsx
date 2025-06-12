import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { ChangeEmailForm } from "@/features/settings/components/change-email-form";
import { ChangeNameForm } from "@/features/settings/components/change-name-form";
import { ChangeIdentificationNumberForm } from "@/features/settings/components/change-identification-number-form";

export async function SettingsAccountPage() {
  return (
    <>
      <SettingsPageHeader
        title="Account"
        description="Update your account settings."
      />

      <ChangeNameForm />
      <ChangeIdentificationNumberForm />
      <ChangeEmailForm />
    </>
  );
}
