import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";

export default function Pricing() {
  const { signIn } = useSignIn();

  const handleAuth = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/new",
    });
  };
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
            Try Compose for free
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Help us perfect PRD generation for Claude Code and task-master.dev
            workflows. Your feedback shapes what we build next.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg border-2 border-[#1B9847] relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#1B9847] text-white px-4 py-2 rounded-full text-sm font-medium">
                Free to try
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                Full access to Compose by qckfx
              </h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-neutral-900">
                  Free
                </span>
                <span className="text-neutral-500 ml-2">while we build</span>
              </div>
              <p className="text-neutral-600">
                Connect repos, generate codebase-grounded PRDs, edit in browser,
                export files.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                "Connect unlimited GitHub repos",
                "Generate comprehensive PRDs and custom technical docs",
                "PRD templates optimized for Claude Code & task-master.dev",
                "AI agent that reads your actual code",
                "Browser editor (like Google Docs)",
                "Export as .md/.txt or copy to clipboard",
                "Direct feedback channel to developers",
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-[#1B9847] mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full bg-[#1B9847] hover:bg-[#158039] text-white text-lg py-6"
              onClick={handleAuth}
            >
              Try it free
            </Button>
          </div>

          <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <h4 className="font-medium mb-2 text-neutral-900">
              What happens next?
            </h4>
            <p className="text-sm text-neutral-700 mb-3">
              We will eventually need to charge to cover AI costs, but early
              users will get:
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Grandfathered pricing (much cheaper)</li>
              <li>• Say in what features we build</li>
              <li>• Plenty of notice before any changes</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500">
              Built by{" "}
              <a href="#" className="text-[#1B9847] hover:underline">
                qckfx
              </a>{" "}
              • Questions?{" "}
              <a
                href="mailto:chris.wood@qckfx.com"
                className="text-[#1B9847] hover:underline"
              >
                chris.wood@qckfx.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
