import { z } from 'zod';

export const announcementSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long.' })
    .max(200, { message: 'Title must not exceed 200 characters.' }),
  body: z
    .string()
    .min(10, { message: 'Body text must be at least 10 characters long.' }),
  published: z.boolean().default(false),
  category: z.string().optional().default('club_business'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'EMERGENCY']).optional().default('MEDIUM'),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;
