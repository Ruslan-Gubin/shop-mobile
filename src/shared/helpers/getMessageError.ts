export const getMessageError = (error: Error | string, defaultMessage: string) =>
  error instanceof Error ? error.message : typeof error === "string" ? error : defaultMessage;
