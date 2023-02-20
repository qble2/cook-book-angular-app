export class ServerResponseError {
  status?: number;
  error?: string; // technical message
  message?: string; // a brief human-readable message
  details?: string[];
  path?: string;
}
