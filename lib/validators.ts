import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (10+ characters)."),
  recaptchaToken: z.string().optional()
});

export type LeadInput = z.infer<typeof leadSchema>;


import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message required"),
  recaptchaToken: z.string().optional(),
  honeypot: z.string().optional(),
});
