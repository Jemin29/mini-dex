import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type PropsWithChildren } from "react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
}

export function createQueryWrapper() {
  const client = createTestQueryClient();
  return function Wrapper({ children }: PropsWithChildren) {
    return React.createElement(QueryClientProvider, { client }, children);
  };
}
