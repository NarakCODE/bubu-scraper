// app/components/scraper/result-tabs.tsx
import { ScrapedData } from '@/lib/scraper';
import { FileText, ImageIcon, Mail, Phone, Users, Video } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { DocumentTab } from './tabs/document-tab';
import { EmailTab } from './tabs/email-tab';
import { ImageTab } from './tabs/image-tab';
import { PhoneTab } from './tabs/phone-tab';
import { SocialTab } from './tabs/social-tab';
import { VideoTab } from './tabs/video-tab';

interface ResultTabsProps {
  data: ScrapedData;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  const socialCount = Object.keys(data.socialLinks).length;

  return (
    <Tabs defaultValue="images" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        {/* Images Tab Trigger */}
        <TabsTrigger value="images" className="flex items-center gap-1.5">
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Images</span>
          {data.images.length > 0 && (
            <Badge variant="secondary">{data.images.length}</Badge>
          )}
        </TabsTrigger>

        {/* Videos Tab Trigger */}
        <TabsTrigger value="videos" className="flex items-center gap-1.5">
          <Video className="h-4 w-4" />
          <span className="hidden sm:inline">Videos</span>
          {data.videos.length > 0 && (
            <Badge variant="secondary">{data.videos.length}</Badge>
          )}
        </TabsTrigger>

        {/* Email Tab Trigger */}
        <TabsTrigger value="email" className="flex items-center gap-1.5">
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Email</span>
          {data.emails.length > 0 && (
            <Badge variant="secondary">{data.emails.length}</Badge>
          )}
        </TabsTrigger>

        {/* Phone Tab Trigger */}
        <TabsTrigger value="phone" className="flex items-center gap-1.5">
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">Phone</span>
          {data.phoneNumbers.length > 0 && (
            <Badge variant="secondary">{data.phoneNumbers.length}</Badge>
          )}
        </TabsTrigger>

        {/* Social Tab Trigger */}
        <TabsTrigger value="social" className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Social</span>
          {socialCount > 0 && <Badge variant="secondary">{socialCount}</Badge>}
        </TabsTrigger>

        {/* Documents Tab Trigger */}
        <TabsTrigger value="documents" className="flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Docs</span>
          {data.documents.length > 0 && (
            <Badge variant="secondary">{data.documents.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Tab Content */}
      <EmailTab emails={data.emails} />
      <ImageTab images={data.images} />
      <VideoTab videos={data.videos} />
      <PhoneTab phoneNumbers={data.phoneNumbers} />
      <SocialTab socialLinks={data.socialLinks} />
      <DocumentTab documents={data.documents} />
    </Tabs>
  );
};
