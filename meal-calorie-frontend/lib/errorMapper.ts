export function mapCalorieApiError(err: any) {
  const fallback = { status: 0, userMessage: "Something went wrong. Please try again.", details: null };

  if (!err || !err.response) {
    return {
      ...fallback,
      userMessage: err?.message || fallback.userMessage,
    };
  }

  const { status, data } = err.response;
  const serverMsg = (data && (data.message || data.error)) || null;

  switch (status) {
    case 400:
      return {
        status,
        userMessage:
          serverMsg ||
          "Invalid request — check dish name and servings and try again.",
        details: data?.details ?? null,
      };

    case 401:
      return {
        status,
        userMessage:
          serverMsg || "Session expired or unauthorized. Please sign in again.",
      };

    case 404:
      return {
        status,
        userMessage:
          serverMsg ||
          "Dish not found. Try a more general name (e.g., 'grilled chicken').",
      };

    case 500:
      return {
        status,
        userMessage: serverMsg || "Server error. Please try again later.",
      };

    default:
      return {
        status,
        userMessage: serverMsg || `Unexpected error (status ${status}).`,
      };
  }
}
