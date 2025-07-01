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
export type PredefinedActionErrorKey = "unauthorized" | "validationError" | "notFound";

type ActionErrors = { [name: string]: ActionState<any> }

export const ACTION_ERRORS: ActionErrors = {
  unauthorized: {
    status: "error",
    message: "You are not allowed to access this resource!",
    errors: {
      general: ["You are not allowed to access this resource!"]
    }
  }
} as const
