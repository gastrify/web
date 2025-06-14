import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const UserAppointmentsSkeleton = () => {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>

        <CardDescription className="flex flex-col gap-1">
          <div className="!mt-2 leading-normal">
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="!m-0 leading-normal">
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="!m-0 leading-normal">
            <Skeleton className="h-4 w-40" />
          </div>

          <div className="!m-0 leading-normal">
            <Skeleton className="h-4 w-52" />
          </div>

          <div className="!m-0 leading-normal">
            <Skeleton className="h-4 w-60" />
          </div>
        </CardDescription>

        <CardAction>
          <Skeleton className="h-10 w-20" />
        </CardAction>
      </CardHeader>
    </Card>
  );
};
