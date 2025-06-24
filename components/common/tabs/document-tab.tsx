import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { FileText, Download } from 'lucide-react';
import { TabsContent, Tabs } from '../../ui/tabs';
import { EmptyState } from '../empty-state';

interface DocumentTabProps {
  documents: string[];
}

export const DocumentTab = ({ documents }: DocumentTabProps) => (
  <TabsContent value="documents" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 flex-shrink-0" />
          Documents
        </CardTitle>
        <CardDescription>Found social media links.</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-medium text-sm sm:text-base truncate pr-2"
                    title={doc}
                  >
                    {doc}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-auto sm:ml-0">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto min-w-[100px]"
                >
                  <a
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden xs:inline sm:inline">Download</span>
                    <span className="xs:hidden sm:hidden">Get</span>
                  </a>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8">
            <EmptyState
              icon={<FileText className="h-8 w-8 sm:h-10 sm:w-10" />}
              title="No Document Found"
              description="No documents found on the page."
            />
          </div>
        )}
      </CardContent>
    </Card>
  </TabsContent>
);
