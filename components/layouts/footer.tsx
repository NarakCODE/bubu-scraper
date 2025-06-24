'use client';

import { Github, Globe, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import Logo from '../common/logo';

const productLinks = [
  { href: '/features', text: 'Features' },
  { href: '/about', text: 'About Us' },
];

const resourcesLinks = [
  { href: '#', text: 'Documentation' },
  { href: '#', text: 'API Status' },
  { href: '#', text: 'Developer API' },
  { href: '#', text: 'Contact Us' },
];

const legalLinks = [
  { href: '#', text: 'Terms of Service' },
  { href: '#', text: 'Privacy Policy' },
  { href: '#', text: 'Cookie Policy' },
];

const socialIcons = [
  { icon: <Github className="h-5 w-5" />, href: '#' },
  { icon: <Twitter className="h-5 w-5" />, href: '#' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
];

const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <li>
    <Link href={href}>
      <span className="text-muted-foreground transition hover:text-foreground">
        {text}
      </span>
    </Link>
  </li>
);

export function Footer() {
  return (
    <footer className="relative w-full bg-background pt-16 mt-32 text-sm">
      <div className="container mx-auto px-6 lg:px-8">
        {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-3"> */}
        {/* Brand and Socials */}
        {/* <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-muted-foreground">
              The simplest way to extract web data without the hassle.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialIcons.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="sr-only">{item.icon.type.displayName}</span>
                  {item.icon}
                </Link>
              ))}
            </div>
          </div> */}

        {/* Link Columns */}
        {/* <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <FooterLink key={link.text} {...link} />
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
              <ul className="space-y-3">
                {resourcesLinks.map((link) => (
                  <FooterLink key={link.text} {...link} />
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <FooterLink key={link.text} {...link} />
                ))}
              </ul>
            </div>
          </div> */}
        {/* </div> */}

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-border pt-8 pb-8 sm:flex-row">
          <p className="mb-4 text-sm text-muted-foreground sm:mb-0">
            &copy; {new Date().getFullYear()} BuBu Scraper. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ by E6 Group
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
