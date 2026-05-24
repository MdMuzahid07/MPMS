/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export const handleApiError = (error: any) => {
  if (!error) return;

  const status = error.status;
  const data = error.data;

  // Extract message from standard backend error structure or fallback
  const message = data?.message || data || "Something went wrong";

  switch (status) {
    case 400:
      toast.error(typeof message === "string" ? message : "Invalid request.");
      break;
    case 401:
      toast.error("Session expired. Please log in again.");
      break;
    case 403:
      toast.error("You don't have permission to do this.");
      break;
    case 404:
      toast.error("Resource not found.");
      break;
    case 500:
      toast.error("Server error. Try again later.");
      break;
    default:
      if (status === "PARSING_ERROR") {
        toast.error("Data validation error.");
      } else {
        toast.error(
          typeof message === "string"
            ? message
            : "An unexpected error occurred.",
        );
      }
      break;
  }
};
