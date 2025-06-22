// app/components/scraper/result-header.tsx
interface ResultHeaderProps {
  title: string | null;
  description: string | null;
}

export const ResultHeader = ({ title, description }: ResultHeaderProps) => {
  if (!title) return null;

  return (
    <div className="text-center space-y-4 w-full">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-base text-muted-foreground max-w-5xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
