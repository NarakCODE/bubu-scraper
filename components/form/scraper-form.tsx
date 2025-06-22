'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';

import {
  ScraperFormSchema,
  type ScraperFormValues,
} from '@/lib/types/scrapers';
import { useScrapeMutation } from '@/lib/hooks/use-scraper';
import type { ScrapedData } from '@/lib/scraper';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  ArrowUpIcon,
  Globe,
  Loader2,
  Paperclip,
  PlusIcon,
  Sparkles,
} from 'lucide-react';

// --- Suggestion Button Sub-component ---
interface SuggestionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}

function SuggestionButton({
  icon,
  label,
  onClick,
  disabled,
}: SuggestionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      size="sm"
      className="text-muted-foreground text-xs rounded-full"
      // className="flex w-full flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-secondary/20 px-4 py-2 text-xs transition-colors sm:w-auto"
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
}

// --- Main Form Component ---

interface ScraperFormProps {
  onScrapeComplete: (data: ScrapedData) => void;
  onScrapeStart: () => void;
  onScrapeError: (error: Error) => void;
}

const EXAMPLE_URLS = [
  { label: 'RUPP', url: 'https://www.rupp.edu.kh/' },
  { label: 'Framer', url: 'https://www.framer.com/' },
  { label: 'W3Schools', url: 'https://www.w3schools.com/' },
  { label: 'KhmerCoders', url: 'https://khmercoder.com/' },
  { label: 'Dribble', url: 'https://dribbble.com/' },
];

export function ScraperForm({
  onScrapeComplete,
  onScrapeStart,
  onScrapeError,
}: ScraperFormProps) {
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  const form = useForm<ScraperFormValues>({
    resolver: zodResolver(ScraperFormSchema),
    defaultValues: { url: '' },
    mode: 'onChange',
  });

  const { mutate, isPending } = useScrapeMutation({
    onSuccess: (data) => {
      onScrapeComplete(data);
      // Add the successfully scraped URL to the recent list
      const url = form.getValues('url');
      setRecentUrls((prev) =>
        [url, ...prev.filter((u) => u !== url)].slice(0, 4)
      );
    },
    onError: (error) => {
      onScrapeError(error);
    },
  });

  function onSubmit(data: ScraperFormValues) {
    onScrapeStart();
    mutate(data.url);
  }

  const handleQuickUrl = (url: string) => {
    form.setValue('url', url, { shouldValidate: true });
  };

  useEffect(() => {
    form.setFocus('url');
  }, [form]);

  const urlValue = form.watch('url');

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center space-y-6 lg:mt-64 mt-44 mb-16 lg:mb-32 ">
      <div className="flex flex-col items-center text-center space-y-2">
        {/* <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <Globe className="h-7 w-7 text-primary" />
        </div> */}
        <h1 className="text-3xl font-bold text-foreground">
          What is BuBu Scraper?
        </h1>
        <p className="text-muted-foreground">
          Paste a URL to instantly extract contact info, social links, and more.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="relative rounded-xl border border-border bg-secondary/20">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a website URL..."
                      disabled={isPending}
                      className="w-full min-h-[80px] resize-none border-none bg-transparent p-4 text-sm focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  disabled
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  disabled
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Project
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!urlValue || isPending || !form.formState.isValid}
                  className="rounded-lg"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUpIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Scrape</span>
                </Button>
              </div>
            </div>
          </div>
          <FormMessage>{form.formState.errors.url?.message}</FormMessage>
        </form>
      </Form>
      <div className="w-full space-y-5">
        <div className="flex flex-wrap items-start gap-2 justify-center">
          {EXAMPLE_URLS.map((example) => (
            <SuggestionButton
              key={example.label}
              icon={<Globe className="h-3 w-3" />}
              label={example.label}
              onClick={() => handleQuickUrl(example.url)}
              disabled={isPending}
            />
          ))}

          {recentUrls.length > 0 && (
            <>
              {recentUrls.map((url) => (
                <Button
                  key={url}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs text-muted-foreground"
                  disabled={isPending}
                  onClick={() => handleQuickUrl(url)}
                >
                  <Globe className="h-3 w-3" />
                  {url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
