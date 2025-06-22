import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { Video, PlayCircle } from 'lucide-react';
import { TabsContent } from '../../ui/tabs';
import { EmptyState } from '../empty-state';
import { VideoPlayer } from '@/components/ui/video-player';

interface VideoTabProps {
  videos: string[];
}

export const VideoTab = ({ videos }: VideoTabProps) => (
  <TabsContent value="videos" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" /> Videos
        </CardTitle>
        <CardDescription>Video content and presentations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <VideoPlayer
                src={video}
                key={index}
                autoPlay
                loop
                showControls={true}
                className="aspect-video"
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Video className="h-10 w-10" />}
            title="No Video Found"
            description="No videos found on the page."
          />
        )}
      </CardContent>
    </Card>
  </TabsContent>
);
