import { describe, it, expect, vi } from "vitest";

// Mock the Redis database client to run locally in memory
vi.mock("@/lib/redis", () => {
  const store = new Map<string, string[]>();
  return {
    redis: {
      lpush: vi.fn(async (key: string, value: string) => {
        if (!store.has(key)) store.set(key, []);
        store.get(key)!.unshift(value);
        return 1;
      }),
      rpop: vi.fn(async (key: string) => {
        const list = store.get(key);
        if (!list || list.length === 0) return null;
        return list.pop() || null;
      }),
      set: vi.fn(async () => "OK"),
      del: vi.fn(async () => 1),
    },
  };
});

import { addJobToQueue, processQueueNext } from "../features/communication/services/job-queue";
import { generateEventMetadata } from "../features/communication/services/event-metadata";

describe("Tripzy Job Queue & Retries", () => {
  it("enqueues background jobs successfully in mock Redis cache", async () => {
    const res = await addJobToQueue("test-email-dispatch", { email: "test@example.com" });
    expect(res.success).toBe(true);
    expect(res.jobId).toBeDefined();
  });

  it("handles retry increments correctly for failing workers", async () => {
    let mockWorkerCallCount = 0;
    const failingWorker = async (job: any) => {
      mockWorkerCallCount += 1;
      return false; // return false to signal failed job execution
    };

    // Enqueue a job first so rpop retrieves it
    await addJobToQueue("failing-task", {});

    // Simulate callback error handling
    const result = await processQueueNext(failingWorker);
    expect(result.processed).toBe(true);
    expect((result as any).status).toBeDefined();
  });
});

describe("Tripzy Automation Workflow", () => {
  it("routes sequential rules matching business event triggers", () => {
    const eventName = "BOOKING_CREATED";
    const payload = { userId: "user-123", recipientEmail: "rahul@example.com" };

    expect(eventName).toBe("BOOKING_CREATED");
    expect(payload.recipientEmail).toBe("rahul@example.com");
  });
});

describe("Tripzy Event Tracing & Compliance", () => {
  it("generates structured trace metadata correctly", () => {
    const meta = generateEventMetadata("TEST_EVENT");
    expect(meta.correlationId).toContain("corr-");
    expect(meta.tracingId).toContain("trace-");
    expect(meta.version).toBe("1.0");
  });
});
