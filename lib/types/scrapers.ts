import { z } from 'zod';

export const ScraperFormSchema = z.object({
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
});

export type ScraperFormValues = z.infer<typeof ScraperFormSchema>;

export interface ScrapedData {
  title: string;
  description: string;
  emails: string[];
  phoneNumbers: string[];
  socialLinks: {
    [platform: string]: string;
  };
  images: string[];
}
