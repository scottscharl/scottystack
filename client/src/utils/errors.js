// Map PocketBase/common errors to user-friendly messages
export function getErrorMessage(error) {
  const message = error?.message || error?.toString() || "";

  // PocketBase specific errors
  if (message.includes("Failed to authenticate")) {
    return "Invalid email or password. Please try again.";
  }

  if (message.includes("validation_invalid_email")) {
    return "Please enter a valid email address.";
  }

  if (message.includes("validation_not_unique")) {
    return "This email is already registered. Try logging in instead.";
  }

  if (message.includes("validation_length_out_of_range")) {
    return "Password must be at least 8 characters long.";
  }

  // Network errors
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  if (message.includes("timeout")) {
    return "The request timed out. Please try again.";
  }

  // Generic fallbacks
  if (message.toLowerCase().includes("unauthorized")) {
    return "Your session has expired. Please log in again.";
  }

  // Return original message if no match, but clean it up
  return message || "An unexpected error occurred. Please try again.";
}
