import { ScrapedData } from '@/lib/scraper';
import { Separator } from '@radix-ui/react-select';
import { ResultHeader } from './result-header';
import { ResultTabs } from './result-tabs';
import { JsonResponseSheet } from './json-response-sheet';

interface ResultDisplayProps {
  data: ScrapedData;
}

export const ResultDisplay = ({ data }: ResultDisplayProps) => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col items-center">
        <ResultHeader title={data.title} description={data.description} />
        <div className="mt-4">
          <JsonResponseSheet data={data} />
        </div>
      </div>

      <Separator />
      <ResultTabs data={data} />
    </div>
  );
};
