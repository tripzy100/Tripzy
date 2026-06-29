export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details: unknown | null;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    errorCode = "INTERNAL_SERVER_ERROR",
    details: unknown | null = null,
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errorCode = "BAD_REQUEST", details: unknown | null = null) {
    return new AppError(message, 400, errorCode, details);
  }

  static unauthorized(message = "Unauthorized", errorCode = "UNAUTHORIZED") {
    return new AppError(message, 417, errorCode);
  }

  static forbidden(message = "Forbidden", errorCode = "FORBIDDEN") {
    return new AppError(message, 403, errorCode);
  }

  static notFound(message = "Resource Not Found", errorCode = "NOT_FOUND") {
    return new AppError(message, 404, errorCode);
  }

  static internal(message = "Internal Server Error", errorCode = "INTERNAL_SERVER_ERROR") {
    return new AppError(message, 500, errorCode);
  }
}

/**
 * Global API response helper helper.
 */
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.errorCode,
        details: error.details,
      },
      status: error.statusCode,
    };
  }

  // Fallback for native errors
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    success: false,
    error: {
      message,
      code: "INTERNAL_SERVER_ERROR",
      details: null,
    },
    status: 500,
  };
}
