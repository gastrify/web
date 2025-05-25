import { createAuthClient } from "better-auth/react";
import {
  usernameClient,
  magicLinkClient,
  twoFactorClient,
  inferAdditionalFields,
  adminClient,
} from "better-auth/client/plugins";
import { toast } from "sonner";

import { auth } from "@/shared/lib/better-auth/server";

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    magicLinkClient(),
    twoFactorClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;

      if (response.status === 429) {
        toast.error("Rate limit exceeded 🚫", {
          duration: 10_000,
          description: "Try again later, take a break!",
        });
      }
    },
  },
});
