export type AppError = {
  title: string;
  message: string;
  cause?: unknown;
};

export function normalizeError(error: unknown): AppError {
  if (error instanceof Error) {
    return { title: "Transaction failed", message: error.message, cause: error };
  }

  return { title: "Unexpected error", message: "Unknown error", cause: error };
}

export function isUserRejected(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message.toLowerCase().includes("user rejected") || message.includes("4001");
}
