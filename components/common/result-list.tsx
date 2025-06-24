'use client';

import type { ScrapedData } from '@/lib/scraper';
import { useState } from 'react';
import { toast } from 'sonner';
import { ScraperForm } from '../form/scraper-form';
import { ResultDisplay } from './result-display';
import { ResultSkeleton } from './result-skeleton';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ActionSearchBar from '../form/action-search-bar';

export const ResultList = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleScrapeStart = () => {
    setIsLoading(true);
    setScrapedData(null);
    setIsDrawerOpen(true); // Open drawer when scraping starts
  };

  const handleScrapeComplete = (data: ScrapedData) => {
    setScrapedData(data);
    setIsLoading(false);
    toast.success(`Scraping Complete!`);
  };

  const handleScrapeError = (error: Error) => {
    setIsLoading(false);
    toast.error(`Scraping Failed: ${error.message}`);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // Reset states when drawer is closed
    setScrapedData(null);
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      {/* <ScraperForm
        onScrapeComplete={handleScrapeComplete}
        onScrapeStart={handleScrapeStart}
        onScrapeError={handleScrapeError}
      /> */}
      <ActionSearchBar
        onScrapeComplete={handleScrapeComplete}
        onScrapeStart={handleScrapeStart}
        onScrapeError={handleScrapeError}
      />

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[100vh] h-full flex flex-col">
          <DrawerHeader>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <DrawerDescription>
                BuBu Scraper can make a mistake sometimes.
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Conditionally render Skeleton or Results */}
            {isLoading && (
              <div className="space-y-4">
                <ResultSkeleton />
              </div>
            )}

            {!isLoading && scrapedData && (
              <div className="space-y-4">
                <ResultDisplay data={scrapedData} />
              </div>
            )}

            {!isLoading && !scrapedData && (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <p>No data available. Please try scraping again.</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
