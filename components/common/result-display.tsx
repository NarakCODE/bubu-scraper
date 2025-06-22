import { ScrapedData } from '@/lib/scraper';
import { Separator } from '@radix-ui/react-select';
import { ResultHeader } from './result-header';
import { ResultTabs } from './result-tabs';

interface ResultDisplayProps {
  data: ScrapedData;
}

export const ResultDisplay = ({ data }: ResultDisplayProps) => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <ResultHeader title={data.title} description={data.description} />
      <Separator />
      <ResultTabs data={data} />
    </div>
  );
};
