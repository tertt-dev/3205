import { z } from 'zod';

export const CreateShortUrlSchema = z.object({
  originalUrl: z.string().url(),
  expiresAt: z.string().datetime().optional(),
  alias: z.string().max(20).optional(),
});

export type CreateShortUrlRequest = z.infer<typeof CreateShortUrlSchema>;

export interface ShortUrlInfo {
  originalUrl: string;
  createdAt: Date;
  clickCount: number;
}

export interface UrlAnalytics extends ShortUrlInfo {
  recentVisitors: string[];
} 