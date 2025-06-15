import { QueryClient } from "@tanstack/react-query";

export function optimisticSet<T>(
  queryClient: QueryClient,
  key: unknown[],
  updater: (prev: T[]) => T[],
) {
  const prev = queryClient.getQueryData<T[]>(key) || [];
  queryClient.setQueryData<T[]>(key, updater(prev));
  return prev;
}

export function rollback<T>(
  queryClient: QueryClient,
  key: unknown[],
  prev: T[],
) {
  if (prev) queryClient.setQueryData<T[]>(key, prev);
}
