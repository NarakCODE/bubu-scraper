import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Button } from '../../ui/button';
import { FileText, Download } from 'lucide-react';
import { TabsContent } from '../../ui/tabs';
import { EmptyState } from '../empty-state';

interface DocumentTabProps {
  documents: string[];
}

export const DocumentTab = ({ documents }: DocumentTabProps) => (
  <TabsContent value="documents" className="mt-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Documents
        </CardTitle>
        <CardDescription>Downloadable files and documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="font-medium truncate" title={doc}>
                  {doc}
                </p>
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={doc} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" /> Download
                </a>
              </Button>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<FileText className="h-10 w-10" />}
            title="No Document Found"
            description="No documents found on the page."
          />
        )}
      </CardContent>
    </Card>
  </TabsContent>
);
