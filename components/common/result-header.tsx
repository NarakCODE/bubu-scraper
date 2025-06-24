// app/components/scraper/result-header.tsx
interface ResultHeaderProps {
  title: string | null;
  description: string | null;
}

export const ResultHeader = ({ title, description }: ResultHeaderProps) => {
  if (!title) return null;

  return (
    <div className="text-center space-y-4 w-full h-fit">
      <h1 className="text-xl md:text-3xl font-bold tracking-tight w-full text-wrap">
        {title}
      </h1>
      {description && (
        <p className="md:text-md text-sm text-muted-foreground w-full mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
