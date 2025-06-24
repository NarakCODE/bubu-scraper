'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Globe,
  Loader2,
  ArrowUpIcon,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import {
  ScraperFormSchema,
  type ScraperFormValues,
} from '@/lib/types/scrapers';
import { useScrapeMutation } from '@/lib/hooks/use-scraper';
import type { ScrapedData } from '@/lib/scraper';

interface ActionSearchBarProps {
  onScrapeComplete: (data: ScrapedData) => void;
  onScrapeStart: () => void;
  onScrapeError: (error: Error) => void;
  defaultOpen?: boolean;
}

interface SuggestionItem {
  id: string;
  label: string;
  url: string;
  icon: React.ReactNode;
  type: 'example' | 'recent';
}

const EXAMPLE_URLS = [
  { label: 'RUPP University', url: 'https://www.rupp.edu.kh/' },
  { label: 'Framer', url: 'https://www.framer.com/' },
  { label: 'Khmer Coder', url: 'https://khmercoder.com/' },
  { label: 'Dribble', url: 'https://dribbble.com/' },
  { label: 'NarakCODE', url: 'https://narakcode.vercel.app/' },
];

function ActionSearchBar({
  onScrapeComplete,
  onScrapeStart,
  onScrapeError,
  defaultOpen = false,
}: ActionSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(defaultOpen);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const debouncedQuery = useDebounce(query, 200);

  const form = useForm<ScraperFormValues>({
    resolver: zodResolver(ScraperFormSchema),
    defaultValues: { url: '' },
    mode: 'onChange',
  });

  const { mutate, isPending } = useScrapeMutation({
    onSuccess: (data) => {
      onScrapeComplete(data);
      // Add the successfully scraped URL to the recent list
      const url = query.trim();
      setRecentUrls((prev) =>
        [url, ...prev.filter((u) => u !== url)].slice(0, 4)
      );
      setQuery('');
      setIsFocused(false);
    },
    onError: (error) => {
      onScrapeError(error);
    },
  });

  // Generate suggestions based on query and recent URLs
  useEffect(() => {
    if (!isFocused) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const allSuggestions: SuggestionItem[] = [];

    // Add example URLs
    EXAMPLE_URLS.forEach((example, index) => {
      if (
        !normalizedQuery ||
        example.label.toLowerCase().includes(normalizedQuery) ||
        example.url.toLowerCase().includes(normalizedQuery)
      ) {
        allSuggestions.push({
          id: `example-${index}`,
          label: example.label,
          url: example.url,
          icon: <Globe className="h-4 w-4 text-blue-500" />,
          type: 'example',
        });
      }
    });

    // Add recent URLs
    recentUrls.forEach((url, index) => {
      if (!normalizedQuery || url.toLowerCase().includes(normalizedQuery)) {
        const displayLabel = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        allSuggestions.push({
          id: `recent-${index}`,
          label: displayLabel,
          url: url,
          icon: <Clock className="h-4 w-4 text-green-500" />,
          type: 'recent',
        });
      }
    });

    setSuggestions(allSuggestions.slice(0, 6)); // Limit to 6 suggestions
  }, [debouncedQuery, isFocused, recentUrls]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isPending) return;

    // Validate URL
    const result = ScraperFormSchema.safeParse({ url: query.trim() });
    if (!result.success) {
      onScrapeError(new Error('Please enter a valid URL'));
      return;
    }

    onScrapeStart();
    mutate(query.trim());
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    setQuery(suggestion.url);
    onScrapeStart();
    mutate(suggestion.url);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: { duration: 0.4 },
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center space-y-6 lg:mt-64 mt-44 mb-16 lg:mb-32">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          What is BuBu Scraper?
        </h1>
        <p className="text-muted-foreground">
          Paste a URL to instantly extract contact info, social links, and more.
        </p>
      </div>

      {/* Search Form */}
      <div className="w-full max-w-xl mx-auto">
        <div className="relative flex flex-col justify-start items-center">
          <div className="w-full sticky top-0 bg-background z-10 pt-4 pb-1">
            <label
              className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block"
              htmlFor="search"
            >
              Enter Website URL
            </label>
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="text"
                placeholder="https://example.com"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={isPending}
                className="pl-3 pr-12 py-2 h-11 text-base rounded-lg focus-visible:ring-offset-0"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <AnimatePresence mode="popLayout">
                  {isPending ? (
                    <motion.div
                      key="loading"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </motion.div>
                  ) : query.length > 0 ? (
                    <motion.button
                      key="submit"
                      type="submit"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-1 rounded-md hover:bg-accent transition-colors"
                      disabled={isPending}
                    >
                      <ArrowUpIcon className="w-4 h-4 text-primary" />
                    </motion.button>
                  ) : (
                    <motion.div
                      key="search"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* Suggestions Dropdown */}
          <div className="w-full">
            <AnimatePresence>
              {isFocused && suggestions.length > 0 && !isPending && (
                <motion.div
                  className="w-full border rounded-md shadow-lg overflow-hidden dark:border-gray-800 bg-white dark:bg-black mt-1"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <motion.ul className="max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <motion.li
                        key={suggestion.id}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                        variants={item}
                        layout
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <span className="text-gray-500 flex-shrink-0">
                            {suggestion.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {suggestion.label}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {suggestion.url}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 capitalize">
                            {suggestion.type}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Press Enter to scrape</span>
                      <span>ESC to cancel</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionSearchBar;
