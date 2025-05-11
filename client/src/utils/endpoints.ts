/**
 * WebSocket endpoint configuration
 * In development, use localhost
 * In production, use the deployed server URL
 */
export const wsEndpoint = process.env.NODE_ENV === 'production'
  ? `wss://${window.location.host}/ws`
  : 'ws://localhost:8080/ws';
