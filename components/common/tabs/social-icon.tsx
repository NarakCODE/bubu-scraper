// app/components/scraper/tabs/social-icon.tsx
import {
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

export const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-4 w-4" />;
    case 'twitter':
      return <Twitter className="h-4 w-4" />;
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4" />;
    case 'youtube':
      return <Youtube className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};
