import { ENV } from "@/config/env";
import { httpClient } from "@/api/httpClient";

const MOCK_LATENCY_MS = 350;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs the mock resolver while the API is mocked, otherwise performs the real HTTP call.
 * Services stay identical for both modes, so switching to NestJS is a single env flag.
 *
 * @param {() => any} mockResolver  synchronous function returning mock data (may throw)
 * @param {{ method?: string, url: string, params?: object, data?: object }} live
 */
export async function request(mockResolver, live) {
  if (ENV.useMockApi) {
    await wait(MOCK_LATENCY_MS);
    // structuredClone keeps the in-memory store immutable from the UI's point of view
    return structuredClone(mockResolver());
  }
  const { data } = await httpClient.request({ method: "get", ...live });
  return data;
}
