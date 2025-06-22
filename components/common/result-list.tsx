'use client';

import { ScrapedData } from '@/lib/scraper';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { ScraperForm } from '../form/scraper-form';
import { ResultDisplay } from './result-display';
import { ResultSkeleton } from './result-skeleton';

export const ResultList = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScrapeStart = () => {
    setIsLoading(true);
    setScrapedData(null);
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

  return (
    <div className="w-full">
      <ScraperForm
        onScrapeComplete={handleScrapeComplete}
        onScrapeStart={handleScrapeStart}
        onScrapeError={handleScrapeError}
      />

      <div className="mt-32">
        {/* Conditionally render Skeleton or Results */}
        {isLoading && <ResultSkeleton />}

        {!isLoading && scrapedData && <ResultDisplay data={scrapedData} />}
      </div>
    </div>
  );
};
