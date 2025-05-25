import { useSession } from "@/shared/hooks/use-session";

export const useIsAdmin = () => {
  const { data: session } = useSession();

  return session?.user.role === "admin";
};
