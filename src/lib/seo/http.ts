import { PublicError } from "./security";
export function apiError(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof PublicError
          ? error.message
          : "The service could not complete this request. Please try again.",
    },
    {
      status: error instanceof PublicError ? error.status : 500,
      headers: {
        "Cache-Control": "no-store",
        ...(error instanceof PublicError && error.status === 429
          ? { "Retry-After": "900" }
          : {}),
      },
    },
  );
}
