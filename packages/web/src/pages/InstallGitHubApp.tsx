import { Button } from "@/components/ui/button";

export default function InstallGitHubApp() {
  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-4 w-full h-full">
      <h1 className="text-2xl font-semibold">Install the qckfx GitHub App</h1>
      <p>
        To generate design docs we need read-only access to the code in your GitHub repositories. Please install our GitHub App so we can securely fetch the source code needed to build your documentation.
      </p>
      <Button asChild>
        <a href="https://github.com/apps/qckfx" target="_blank" rel="noopener noreferrer">
          Install GitHub App
        </a>
      </Button>
    </div>
  );
} 