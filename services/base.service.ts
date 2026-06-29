import { z } from "zod";
import { AppError } from "@/utils/errors";

export abstract class BaseService {
  protected logger: typeof console;

  constructor() {
    this.logger = console; // Replace with structured logger in production if necessary
  }

  /**
   * Safe Zod validator wrapper that throws unified bad-request application errors.
   */
  protected validate<T>(schema: z.Schema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errorMap = result.error.flatten().fieldErrors;
      throw new AppError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        errorMap
      );
    }
    return result.data;
  }

  /**
   * Helper utility to format business execution steps.
   */
  protected logInfo(message: string, context?: Record<string, any>) {
    this.logger.info(`[SERVICE INFO]: ${message}`, context ? JSON.stringify(context) : "");
  }

  protected logError(message: string, error?: unknown) {
    this.logger.error(`[SERVICE ERROR]: ${message}`, error);
  }
}
