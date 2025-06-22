'use client';

import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../../ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { ImageIcon } from 'lucide-react';
import { TabsContent } from '../../ui/tabs';
import { EmptyState } from '../empty-state';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/pagination';

// A working shimmer effect for the blur placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f0f0f0" offset="20%" />
      <stop stop-color="#e0e0e0" offset="50%" />
      <stop stop-color="#f0f0f0" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f0f0f0" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const shimmerDataUrl = `data:image/svg+xml;base64,${toBase64(
  shimmer(700, 475)
)}`;

interface ImageTabProps {
  images: string[];
}

const IMAGES_PER_PAGE = 8;

export const ImageTab: React.FC<ImageTabProps> = ({ images }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingImages, setDownloadingImages] = useState<Set<string>>(
    new Set()
  );

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const goToPreviousPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    setDownloadingImages((prev) => new Set(prev).add(imageUrl));
    try {
      // Fetching images client-side can be blocked by CORS.
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('CORS or network issue');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `scraped-image-${index}.jpg`;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Image downloaded: ${filename}`);
    } catch (error) {
      console.error('Direct download failed, trying fallback:', error);
      // Fallback: Open in new tab for manual download
      try {
        window.open(imageUrl, '_blank');
        toast.info('Image opened in a new tab for manual saving.');
      } catch (fallbackError) {
        toast.error(
          'Could not download or open image. Please try right-clicking to save.'
        );
      }
    } finally {
      setDownloadingImages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(imageUrl);
        return newSet;
      });
    }
  };

  return (
    <TabsContent value="images" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> Image Gallery
          </CardTitle>
          <CardDescription>
            Found {images.length} images on the page. Hover over an image to
            download.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentImages.map((image, index) => {
                  const globalIndex = startIndex + index;
                  const isDownloading = downloadingImages.has(image);

                  return (
                    <div
                      key={`${image}-${globalIndex}`}
                      className="group relative"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <Image
                          src={image || '/placeholder.svg'}
                          alt={`Scraped Image ${globalIndex + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-all duration-300 group-hover:brightness-75"
                          placeholder="blur"
                          blurDataURL={shimmerDataUrl}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300"
                            onClick={(e) => {
                              e.preventDefault();
                              downloadImage(image, globalIndex);
                            }}
                            disabled={isDownloading}
                          >
                            <span className="sr-only">Download</span>
                            {isDownloading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <Download className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={goToPreviousPage}
                          aria-disabled={currentPage === 1}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <span className="text-sm font-medium px-4">
                          Page {currentPage} of {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={goToNextPage}
                          aria-disabled={currentPage === totalPages}
                          className={
                            currentPage === totalPages
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No Images Found"
              description="The scraper couldn't find any images on this page."
              icon={<ImageIcon className="h-10 w-10" />}
            />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
