'use client';

import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { ScrapedData } from '../scraper';
import axiosClient from '../api/axios-client';

// This function contains the actual API call logic.
async function scrapeUrl(url: string): Promise<ScrapedData> {
  const response = await axiosClient.post('/scrape', { url });
  return response.data;
}

// Define the specific types for our mutation for better type-safety
type ScrapeMutationOptions = UseMutationOptions<
  ScrapedData, // Type of data returned on success
  Error, // Type of error
  string, // Type of variables passed to mutationFn (the URL)
  unknown // Type of context
>;

export function useScrapeMutation(options?: ScrapeMutationOptions) {
  return useMutation({
    // The core mutation function is always the same
    mutationFn: scrapeUrl,
    // Spread any additional options passed in from the component
    ...options,
  });
}
