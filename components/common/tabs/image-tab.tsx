'use client';

import { useState } from 'react';
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

interface ImageTabProps {
  images: string[];
}

const IMAGES_PER_PAGE = 16;

export const ImageTab = ({ images }: ImageTabProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  const handlePrevPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <TabsContent value="images" className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" /> Image Gallery
          </CardTitle>
          <CardDescription>
            Visual content and photos found on the page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="space-y-2 group">
                    <a
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`Scraped Image ${index + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </a>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={handlePrevPage}
                          aria-disabled={currentPage === 1}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : undefined
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
                          onClick={handleNextPage}
                          aria-disabled={currentPage === totalPages}
                          className={
                            currentPage === totalPages
                              ? 'pointer-events-none opacity-50'
                              : undefined
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
