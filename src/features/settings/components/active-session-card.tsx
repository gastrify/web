"use client";

import { MinusCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  TypographyMuted,
  TypographyP,
} from "@/shared/components/ui/typography";
import { useActiveSessionCard } from "@/features/settings/hooks/use-active-session-card";
import type { Session } from "@/shared/types";

interface Props {
  session: Omit<Session["session"], "id">;
  isCurrentSession: boolean;
  isSessionsFetching: boolean;
}

export const ActiveSessionCard = ({
  session,
  isCurrentSession,
  isSessionsFetching,
}: Props) => {
  const { t } = useTranslation("settingsProfile");
  const { handleRevokeSession } = useActiveSessionCard();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          {t("security.userAgent")}
          {isCurrentSession && <Badge>{t("security.current")}</Badge>}
        </CardTitle>
        <CardDescription>{session.userAgent}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-0 text-sm">
        <div className="flex items-center gap-2">
          <TypographyP>{t("security.ipAddress")}:</TypographyP>
          <TypographyMuted>{session.ipAddress}</TypographyMuted>
        </div>
        <div className="flex items-center gap-2">
          <TypographyP>{t("security.createdAt")}:</TypographyP>
          <TypographyMuted>
            {new Date(session.createdAt).toLocaleString()}
          </TypographyMuted>
        </div>
        <div className="flex items-center gap-2">
          <TypographyP>{t("security.updatedAt")}:</TypographyP>
          <TypographyMuted>
            {new Date(session.updatedAt).toLocaleString()}
          </TypographyMuted>
        </div>
        <div className="flex items-center gap-2">
          <TypographyP>{t("security.expiresAt")}:</TypographyP>
          <TypographyMuted>
            {new Date(session.expiresAt).toLocaleString()}
          </TypographyMuted>
        </div>
      </CardContent>

      {!isCurrentSession && !isSessionsFetching && (
        <CardFooter>
          <Button
            variant="destructive"
            size="sm"
            type="button"
            onClick={() => handleRevokeSession(session.token)}
          >
            <MinusCircleIcon />
            {t("security.revoke")}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
