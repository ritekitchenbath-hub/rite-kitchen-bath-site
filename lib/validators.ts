import { z } from "zod";
import { PROJECT_TYPES, TIMELINES } from "@/lib/lead-options";

export { PROJECT_TYPES, TIMELINES } from "@/lib/lead-options";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email.").max(200),
  phone: z.string().trim().max(40).optional(),
  projectType: z.enum(PROJECT_TYPES),
  timeline: z.enum(TIMELINES),
  note: z.string().trim().max(500, "Keep the note under 500 characters.").optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Packed into HubSpot `message` so filtration shows on the contact without new CRM properties. */
export function formatLeadMessage(lead: LeadInput) {
  const lines = ["Project type: " + lead.projectType, "Timeline: " + lead.timeline];
  if (lead.note) lines.push("", lead.note);
  return lines.join("\n");
}
