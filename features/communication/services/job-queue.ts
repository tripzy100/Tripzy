import { redis } from "@/lib/redis";

interface Job {
  id: string;
  name: string;
  payload: any;
  retries: number;
}

/**
 * Pushes a background job to the Redis task queue.
 */
export async function addJobToQueue(jobName: string, payload: any) {
  const job: Job = {
    id: `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: jobName,
    payload,
    retries: 0,
  };

  try {
    await redis.lpush("tripzy:jobs:queue", JSON.stringify(job));
    return { success: true, jobId: job.id };
  } catch (error) {
    console.error("Failed to enqueue job:", error);
    return { success: false };
  }
}

/**
 * Processes a single job from the Redis queue. Supports exponential backoffs.
 */
export async function processQueueNext(workerCallback: (job: Job) => Promise<boolean>) {
  try {
    const jobData = await redis.rpop("tripzy:jobs:queue");
    if (!jobData) return { processed: false, reason: "Queue empty" };

    const job: Job = JSON.parse(jobData);
    const success = await workerCallback(job);

    if (!success) {
      return handleFailedJob(job);
    }

    return { processed: true, jobId: job.id, status: "SUCCESS" };
  } catch (error: any) {
    console.error("Queue process failure:", error);
    return { processed: false, error: error.message };
  }
}

/**
 * Handles job retries or redirects them to the Dead Letter Queue (DLQ).
 */
async function handleFailedJob(job: Job) {
  const maxRetries = 3;
  if (job.retries >= maxRetries) {
    // Write to DLQ list
    await redis.lpush("tripzy:jobs:dlq", JSON.stringify(job));
    return { processed: true, jobId: job.id, status: "DLQ" };
  }

  // Exponential backoff retry delay logic
  job.retries += 1;
  const backoffMs = Math.pow(2, job.retries) * 1000;
  
  // Re-enqueue job after delay backoff
  setTimeout(async () => {
    await redis.lpush("tripzy:jobs:queue", JSON.stringify(job));
  }, backoffMs);

  return { processed: true, jobId: job.id, status: "RETRIED", attempt: job.retries };
}
