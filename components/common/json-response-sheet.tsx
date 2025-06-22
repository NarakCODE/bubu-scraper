'use client';

import type React from 'react';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Check,
  Copy,
  FileJson,
  Search,
  Download,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import type { ScrapedData } from '@/lib/scraper';

interface JsonResponseSheetProps {
  data: ScrapedData | null;
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

export function JsonResponseSheet({
  data,
  children,
  title = 'Raw JSON Response',
  description = 'This is the complete, raw data object returned from the scrape.',
}: JsonResponseSheetProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const jsonDataString = useMemo(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const filteredJsonString = useMemo(() => {
    if (!searchTerm.trim()) return jsonDataString;

    const lines = jsonDataString.split('\n');
    const filteredLines = lines.filter((line) =>
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredLines.length > 0
      ? filteredLines.join('\n')
      : 'No matches found';
  }, [jsonDataString, searchTerm]);

  const dataStats = useMemo(() => {
    if (!data) return null;

    const jsonSize = new Blob([jsonDataString]).size;
    const lines = jsonDataString.split('\n').length;
    const keys = Object.keys(data).length;

    return {
      size:
        jsonSize < 1024
          ? `${jsonSize} B`
          : `${(jsonSize / 1024).toFixed(1)} KB`,
      lines,
      keys,
    };
  }, [data, jsonDataString]);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      toast.error('Clipboard API not available on your browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(jsonDataString);
      setIsCopied(true);
      toast.success('JSON copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy JSON. Please check browser permissions.');
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([jsonDataString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraped-data-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('JSON file downloaded!');
    } catch (err) {
      console.error('Failed to download:', err);
      toast.error('Failed to download JSON file.');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (!data) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          {children || (
            <Button variant="outline" disabled>
              <FileJson className="h-4 w-4 mr-2" />
              View Raw JSON
            </Button>
          )}
        </SheetTrigger>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline">
            <FileJson className="h-4 w-4 mr-2" />
            View Raw JSON
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        className={`flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-full sm:max-w-4xl' : 'w-full sm:max-w-lg'
        }`}
      >
        <SheetHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0 "
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <SheetTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              {title}
            </SheetTitle>
          </div>

          <SheetDescription>{description}</SheetDescription>

          {dataStats && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {dataStats.keys} keys
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {dataStats.lines} lines
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {dataStats.size}
              </Badge>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full rounded-md border">
            <div className="p-4">
              <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
                <code className="language-json">
                  {searchTerm && filteredJsonString === 'No matches found' ? (
                    <div className="text-muted-foreground text-center py-8">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No matches found for "{searchTerm}"</p>
                    </div>
                  ) : (
                    <JsonSyntaxHighlighter
                      content={filteredJsonString}
                      searchTerm={searchTerm}
                    />
                  )}
                </code>
              </pre>
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleCopy} className="flex-1">
            {isCopied ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {isCopied ? 'Copied!' : 'Copy JSON'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Simple JSON syntax highlighter component
function JsonSyntaxHighlighter({
  content,
  searchTerm,
}: {
  content: string;
  searchTerm: string;
}) {
  const highlightedContent = useMemo(() => {
    if (!searchTerm) {
      return content.replace(
        /("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([{}[\],:])/g,
        (match, string, boolean, number, punctuation) => {
          if (string) return `<span class="text-green-600">${match}</span>`;
          if (boolean) return `<span class="text-blue-600">${match}</span>`;
          if (number) return `<span class="text-purple-600">${match}</span>`;
          if (punctuation) return `<span class="text-gray-500">${match}</span>`;
          return match;
        }
      );
    }

    // Highlight search terms
    const regex = new RegExp(
      `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi'
    );
    return content
      .replace(
        regex,
        '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
      )
      .replace(
        /("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([{}[\],:])/g,
        (match, string, boolean, number, punctuation) => {
          if (string) return `<span class="text-green-600">${match}</span>`;
          if (boolean) return `<span class="text-blue-600">${match}</span>`;
          if (number) return `<span class="text-purple-600">${match}</span>`;
          if (punctuation) return `<span class="text-gray-500">${match}</span>`;
          return match;
        }
      );
  }, [content, searchTerm]);

  return <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
}
