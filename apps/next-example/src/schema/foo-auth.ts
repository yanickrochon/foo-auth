import z from "zod";

export const credentialsValidation = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
  csrfToken: z.string(),
});
