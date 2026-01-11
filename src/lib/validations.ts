import { z } from "zod";

export const partnershipSchema = z.object({
    name1: z.string().min(1, { message: "Name 1 is required" }).max(50),
    email1: z.string().email().optional().or(z.literal("")),
    name2: z.string().min(1, { message: "Name 2 is required" }).max(50),
    email2: z.string().email().optional().or(z.literal("")),
    quote: z.string().max(200).optional().or(z.literal("")),
    startDate: z.date(),
});

export const memorySchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(100),
    description: z.string().max(500).optional(),
    date: z.date(),
    image: z.any().optional(),
});

export type PartnershipFormValues = z.infer<typeof partnershipSchema>;
export type MemoryFormValues = z.infer<typeof memorySchema>;
