export type ActionResult<T = void> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export type IdActionResult = ActionResult<{ id: string }>;
