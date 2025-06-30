export type ErrorObject = Record<string, string[] | undefined>

export type ActionState<T = void> =
  | { status: "success", data?: T }
  | { status: "error"; message?: string, errors: ErrorObject }

export function getFieldError(
  state: ActionState | null,
  field: string
): string | undefined {
  if (state?.status === "error") {
    const error = state.errors[field]
    return Array.isArray(error) ? error.join("\n") : error
  }
  return undefined
}
