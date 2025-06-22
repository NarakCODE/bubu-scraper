'use client';

import {
  Feather,
  PackageSearch,
  Timer,
  Zap,
  ZoomIn,
  Rocket,
  Sparkles,
  MessageSquareHeart,
} from 'lucide-react';
import { motion } from 'motion/react';
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="relative overflow-hidden rounded-lg p-6 bg-card border group hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
    <div className="absolute -top-1/2 -right-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
    <div className="relative z-10">
      <span className="mb-6 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
        {icon}
      </span>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="leading-7 text-muted-foreground">{description}</p>
    </div>
  </div>
);

export const FeatureSection = () => {
  const features = [
    {
      icon: <PackageSearch className="size-6" />,
      title: 'Comprehensive Extraction',
      description:
        'Automatically scan and pull all critical contact information, including emails, phone numbers, and social media profiles, from any webpage in a single pass.',
    },
    {
      icon: <Rocket className="size-6" />,
      title: 'Instant Results',
      description:
        'Our optimized scraping engine delivers the data you need in seconds. No more waiting—get actionable contact information right away.',
    },
    {
      icon: <MessageSquareHeart className="size-6" />,
      title: 'Intuitive Interface',
      description:
        'Engage with our clean, conversational UI. The chatbot and organized results tabs make the entire data extraction process simple and enjoyable.',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2 className="mb-4 bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-foreground/70 dark:via-foreground dark:to-foreground/70 md:text-4xl lg:text-5xl">
            Why BuBu Scraper?
          </h2>
          <p className="text-muted-foreground md:text-lg">
            We focus on speed, accuracy, and a user experience that gets you the
            data you need without the hassle.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
