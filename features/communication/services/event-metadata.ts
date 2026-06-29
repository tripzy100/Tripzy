import crypto from "crypto";

export interface EventMetadata {
  correlationId: string;
  tracingId: string;
  version: string;
  timestamp: Date;
}

/**
 * Attaches tracing IDs to a business event schema.
 */
export function generateEventMetadata(eventName: string, version = "1.0"): EventMetadata {
  const correlationId = `corr-${crypto.randomUUID()}`;
  const tracingId = `trace-${crypto.randomUUID()}`;
  
  return {
    correlationId,
    tracingId,
    version,
    timestamp: new Date(),
  };
}
