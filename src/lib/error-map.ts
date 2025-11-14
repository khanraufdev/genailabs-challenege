export type FriendlyError = {
  title: string;
  message: string;
  suggestion?: string;
  severity: "info" | "warning" | "error";
};

export type ServerErrorPayload = {
  message?: string;
  status?: number;
  code?: string | number;
};

export const mapDuplexError = (
  err: ServerErrorPayload | undefined,
  modelId?: string
): FriendlyError => {
  const status = Number((err?.status ?? 0) as number);
  const code = String(err?.code ?? "");
  const msg = String(err?.message ?? "").toLowerCase();

  // 404 - model unavailable on OpenRouter
  if (
    status === 404 ||
    msg.includes("no endpoints found") ||
    msg.includes("model not found")
  ) {
    return {
      title: "Model unavailable",
      message: `The selected model${modelId ? ` (${modelId})` : ""} is not available on the provider.`,
      suggestion: "Choose another model from the list.",
      severity: "error",
    };
  }

  // 401/403 - auth or key issues
  if (status === 401 || status === 403) {
    return {
      title: "Authentication error",
      message: "The request was not authorized.",
      suggestion:
        "Verify OPENROUTER_API_KEY is set and your session is valid.",
      severity: "error",
    };
  }

  // 429 - rate limit
  if (status === 429) {
    return {
      title: "Rate limited",
      message: "Too many requests in a short period.",
      suggestion: "Please wait a moment and try again.",
      severity: "warning",
    };
  }

  // 5xx and unknown
  if (status >= 500 || status === 0) {
    return {
      title: "Server error",
      message: "The provider returned an error.",
      suggestion: "Retry or switch to a different model.",
      severity: "error",
    };
  }

  // generic fallback
  return {
    title: code ? String(code) : "Request error",
    message:
      err?.message ||
      "The request failed. Please review your configuration and try again.",
    severity: "error",
  };
};

export const isGlobalError = (err: ServerErrorPayload | undefined) => {
  const status = Number((err?.status ?? 0) as number);
  return status === 401 || status === 403 || status === 429;
};


