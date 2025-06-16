// API Error Handling Utilities

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export class ApiException extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Create standardized API error
export function createApiError(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown
): ApiError {
  return {
    message,
    status,
    code,
    details,
  };
}

// Create standardized API response
export function createApiResponse<T>(
  data?: T,
  error?: ApiError
): ApiResponse<T> {
  return {
    data,
    error,
    success: !error,
  };
}

// Handle fetch errors
export async function handleApiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiException(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData.details
      );
    }

    const data = await response.json();
    return createApiResponse<T>(data);
  } catch (error) {
    if (error instanceof ApiException) {
      return createApiResponse<T>(undefined, {
        message: error.message,
        status: error.status,
        code: error.code,
        details: error.details,
      });
    }

    // Network or other errors
    return createApiResponse<T>(undefined, {
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      status: 0,
      code: "NETWORK_ERROR",
    });
  }
}

// Handle Prisma errors
export function handlePrismaError(error: unknown): ApiError {
  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaError = error as { code: string; message: string };

    if (prismaError.code === "P2002") {
      return createApiError(
        "A record with this value already exists",
        409,
        "DUPLICATE_ENTRY"
      );
    }

    if (prismaError.code === "P2025") {
      return createApiError("Record not found", 404, "NOT_FOUND");
    }

    if (prismaError.code === "P2003") {
      return createApiError(
        "Foreign key constraint failed",
        400,
        "FOREIGN_KEY_CONSTRAINT"
      );
    }

    if (prismaError.code === "P2014") {
      return createApiError(
        "The change you are trying to make would violate the required relation",
        400,
        "RELATION_VIOLATION"
      );
    }

    // Default Prisma error
    return createApiError("Database operation failed", 500, "DATABASE_ERROR", {
      originalError: prismaError.message,
    });
  }

  return createApiError("Database operation failed", 500, "DATABASE_ERROR");
}

// Validate required fields
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): ApiError | null {
  const missingFields = requiredFields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  });

  if (missingFields.length > 0) {
    return createApiError(
      `Missing required fields: ${missingFields.join(", ")}`,
      400,
      "MISSING_FIELDS",
      { missingFields }
    );
  }

  return null;
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
