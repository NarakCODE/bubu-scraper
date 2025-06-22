// app/components/ui/empty-state.tsx
import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 space-y-4 bg-muted/50 rounded-lg border-2 border-dashed">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-muted-foreground max-w-sm">{description}</p>
      </div>
    </div>
  );
};
