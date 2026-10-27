import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email.").max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Tell us a bit more (10+ characters).").max(5000),
});

export type LeadInput = z.infer<typeof leadSchema>;
