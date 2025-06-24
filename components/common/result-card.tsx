// app/components/scraper/ResultCard.tsx
'use client';

import * as React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrapedData } from '@/lib/scraper';
import { motion } from 'motion/react';
import { ResultTabs } from './result-tabs';
import { ScanSearch } from 'lucide-react';

// Animation variants from the provided component
const drawerVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
    rotateX: 5,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
};

interface ResultCardProps {
  data: ScrapedData;
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultCard({ data, isOpen, onClose }: ResultCardProps) {
  const hasResults =
    data.emails.length > 0 ||
    data.phoneNumbers.length > 0 ||
    Object.keys(data.socialLinks).length > 0 ||
    data.images.length > 0 ||
    data.videos.length > 0 ||
    data.documents.length > 0;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-w-3xl mx-auto p-6 rounded-2xl shadow-xl">
        <motion.div
          variants={drawerVariants as any}
          initial="hidden"
          animate="visible"
          className="mx-auto w-full space-y-6"
        >
          <motion.div variants={itemVariants as any}>
            <DrawerHeader className="px-0 space-y-2.5">
              <DrawerTitle className="text-2xl font-semibold flex items-center gap-2.5 tracking-tighter">
                <motion.div variants={itemVariants as any}>
                  <div className="p-1.5 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shadow-inner">
                    <ScanSearch className="w-8 h-8 text-zinc-900 dark:text-white" />
                  </div>
                </motion.div>
                <motion.span variants={itemVariants as any}>
                  Scraping Results
                </motion.span>
              </DrawerTitle>
              <motion.div variants={itemVariants as any}>
                <DrawerDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 tracking-tighter">
                  {hasResults
                    ? "We've extracted the following information from the provided URL. Explore the tabs below to see the details."
                    : "We couldn't find specific contact information, but here's a summary of the general data we scraped."}
                </DrawerDescription>
              </motion.div>
            </DrawerHeader>
          </motion.div>

          <motion.div variants={itemVariants as any}>
            <ResultTabs data={data} />
          </motion.div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
