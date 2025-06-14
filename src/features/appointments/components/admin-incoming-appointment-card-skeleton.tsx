import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const AdminIncomingAppointmentCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription className="flex items-center">
              <div className="flex flex-1 flex-col space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex flex-1 flex-col space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-36" />
              </div>
            </CardDescription>
            <CardAction className="pt-2">
              <Skeleton className="h-9 w-20" />
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
