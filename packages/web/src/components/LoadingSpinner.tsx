const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;