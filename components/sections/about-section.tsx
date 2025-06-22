'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { Facebook, GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  socialLinks?: { platform: 'github' | 'twitter' | 'linkedin'; url: string }[];
}

interface TeamProps {
  title?: string;
  subtitle?: string;
  members?: TeamMember[];
  className?: string;
}

// Default team members data
const defaultMembers: TeamMember[] = [
  {
    name: 'Sun Rosa',
    role: 'Team Leader & Coder',
    imageUrl: '/team/image-1.jpg',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Lu Channarak',
    role: 'Coder & Creator of BuBu Scraper',
    imageUrl: '/team/image-7.jpg',
    socialLinks: [{ platform: 'github', url: 'https://github.com/NarakCODE' }],
  },
  {
    name: 'Sreang Lyhour',
    role: 'Coder & Designer',
    imageUrl: '/team/image-3.jpg',
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Soun Sopanha',
    role: 'Slide Designer',
    imageUrl: '/team/image-4.jpg',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'github', url: 'https://github.com' },
    ],
  },
  {
    name: 'Hea Sonetra',
    role: 'Researcher',
    imageUrl: '/team/image-5.jpg',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Srun Vannara',
    role: 'Researcher',
    imageUrl: '/team/image-6.jpg',
    socialLinks: [
      { platform: 'github', url: 'https://github.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
  {
    name: 'Lim Samnang',
    role: 'Researcher',
    imageUrl: '/team/image-2.jpg',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'linkedin', url: 'https://linkedin.com' },
    ],
  },
];

export default function AboutSection({
  title = 'Our people make us great',
  subtitle = "You'll interact with talented professionals, will be challenged to solve difficult problems and think in new and creative ways.",
  members = defaultMembers,
  className,
}: TeamProps) {
  return (
    <section
      className={cn(
        'relative w-full overflow-hidden py-16 md:py-24',
        className
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2 className="mb-4 bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-foreground/70 dark:via-foreground dark:to-foreground/70 md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground md:text-lg">{subtitle}</p>
        </div>

        {/* Team members grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {members.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
function TeamMemberCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <img
          src={member.imageUrl}
          alt={member.name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Social links that appear on hover */}
        {member.socialLinks && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {member.socialLinks.map((link) => (
              <Link
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground"
              >
                {link.platform === 'github' && (
                  <GithubIcon className="h-5 w-5" />
                )}
                {link.platform === 'twitter' && (
                  <Facebook className="h-5 w-5" />
                )}
                {link.platform === 'linkedin' && (
                  <LinkedinIcon className="h-5 w-5" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Name and role */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold">{member.name}</h3>
        <p className="text-sm text-primary">{member.role}</p>
      </div>
    </div>
  );
}
