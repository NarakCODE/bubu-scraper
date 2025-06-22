// app/components/scraper/tabs/phone-tab.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { Phone } from 'lucide-react';
import { TabsContent } from '../../ui/tabs';
import { EmptyState } from '../empty-state';

interface PhoneTabProps {
  phoneNumbers: string[];
}

export const PhoneTab = ({ phoneNumbers }: PhoneTabProps) => (
  <TabsContent value="phone" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" /> Phone Numbers
        </CardTitle>
        <CardDescription>Found phone numbers on the page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {phoneNumbers.length > 0 ? (
          phoneNumbers.map((phone, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <a href={`tel:${phone}`} className="font-medium hover:underline">
                {phone}
              </a>
              <Button asChild size="sm" variant="outline">
                <a href={`tel:${phone}`}>
                  <Phone className="h-4 w-4 mr-2" /> Call
                </a>
              </Button>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<Phone className="h-10 w-10" />}
            title="No Phone Number Found"
            description="No phone numbers found on the page."
          />
        )}
      </CardContent>
    </Card>
  </TabsContent>
);
