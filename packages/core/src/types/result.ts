export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export function Ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function Err<E = Error>(error: E): Result<never, E> {
  return { success: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success;
}

export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}

export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error instanceof Error ? result.error : new Error(String(result.error));
}
