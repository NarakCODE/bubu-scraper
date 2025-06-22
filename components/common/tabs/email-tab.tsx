import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { Mail } from 'lucide-react';
import { TabsContent } from '../../ui/tabs';
import { EmptyState } from '../empty-state';

interface EmailTabProps {
  emails: string[];
}

export const EmailTab = ({ emails }: EmailTabProps) => (
  <TabsContent value="email" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> Email Addresses
        </CardTitle>
        <CardDescription>Found email addresses on the page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {emails.length > 0 ? (
          emails.map((email, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <a
                href={`mailto:${email}`}
                className="font-medium hover:underline"
              >
                {email}
              </a>
              <Button asChild size="sm" variant="outline">
                <a href={`mailto:${email}`}>
                  <Mail className="h-4 w-4 mr-2" /> Send
                </a>
              </Button>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Mail className="h-10 w-10" />}
            title="No Email Found"
            description="No emails found on the page."
          />
        )}
      </CardContent>
    </Card>
  </TabsContent>
);
