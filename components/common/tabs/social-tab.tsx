// app/components/scraper/tabs/social-tab.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { Users, ExternalLink } from 'lucide-react';
import { TabsContent } from '../../ui/tabs';
import { getSocialIcon } from './social-icon';
import { EmptyState } from '../empty-state';

interface SocialTabProps {
  socialLinks: Record<string, string>;
}

export const SocialTab = ({ socialLinks }: SocialTabProps) => (
  <TabsContent value="social" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Social Media
        </CardTitle>
        <CardDescription>Found social media links.</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(socialLinks).length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(socialLinks).map(([platform, url]) => (
              <Button
                asChild
                key={platform}
                variant="outline"
                className="flex items-center gap-2 justify-start h-12"
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {getSocialIcon(platform)}
                  <span className="capitalize flex-1 text-left">
                    {platform}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </Button>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="h-10 w-10" />}
            title="No Social Media Found"
            description="No social media links found on the page."
          />
        )}
      </CardContent>
    </Card>
  </TabsContent>
);
