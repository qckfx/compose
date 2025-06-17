import { z } from "zod";

export const DocTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isDefault: z.boolean(),
  order: z.number(),
});

export const TemplatesResponseSchema = z.array(TemplateSchema);

export type Template = z.infer<typeof TemplateSchema>;
