/**
 * Runtime configuration read from frontend/.env.
 * REACT_APP_USE_MOCK_API=true keeps the app on the in-memory sample data;
 * set it to "false" once the NestJS API is reachable at REACT_APP_BACKEND_URL.
 */
export const ENV = {
  apiBaseUrl: `${process.env.REACT_APP_BACKEND_URL}/api`,
  useMockApi: process.env.REACT_APP_USE_MOCK_API !== "false",
};
