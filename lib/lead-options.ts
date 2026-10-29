export const PROJECT_TYPES = ["Kitchen", "Bath", "Both", "Other"] as const;
export const TIMELINES = ["ASAP", "1-3 months", "Just researching"] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type Timeline = (typeof TIMELINES)[number];
