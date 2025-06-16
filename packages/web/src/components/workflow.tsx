import { useSignIn } from "@clerk/clerk-react";

export default function Workflow() {
  const { signIn } = useSignIn();

  const handleAuth = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/new",
      redirectUrlComplete: "/new",
    });
  };
  const steps = [
    {
      number: "1",
      title: "Connect your repo",
      description:
        "Point us at your GitHub repo. We clone it to a read-only sandbox (do not store your code).",
      example: "Takes 2-5 minutes to analyze your codebase",
    },
    {
      number: "2",
      title: "Our agent browses your code",
      description:
        "Like Claude Code, but for docs. It autonomously navigates your repo to understand patterns.",
      example: "Reads your API routes, components, database schema, etc.",
    },
    {
      number: "3",
      title: "Generate docs with templates",
      description:
        "Choose from templates (ADRs, RFCs, TaskMaster PRDs) used by top tech companies.",
      example: "Creates first draft based on your actual code patterns",
    },
    {
      number: "4",
      title: "Edit in browser, then export",
      description:
        "Google Docs-style editor to review and edit. Export as .md/.txt or copy to clipboard.",
      example: "Iterate until it is exactly what you need",
    },
  ];

  return (
    <section id="workflow" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
            How it works
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Connect repo → Agent reads code → Generate docs → Edit in browser →
            Export
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-6 mb-12 last:mb-0"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#1B9847] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-neutral-600 mb-3">{step.description}</p>
                <div className="bg-neutral-100 rounded-lg p-3 text-sm text-neutral-700 italic border-l-4 border-[#1B9847]">
                  {step.example}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-yellow-50 rounded-lg p-8 border border-yellow-200">
          <h3 className="text-xl font-bold mb-4 text-neutral-900">
            We are just getting started
          </h3>
          <p className="text-neutral-700 mb-6">
            This is the 1 thing we are focused on getting right. We have more
            features planned, but want your feedback to help us decide what to
            build next.
          </p>
          <button
            onClick={handleAuth}
            className="px-8 py-3 bg-[#1B9847] text-white rounded-lg hover:bg-[#158039] transition-colors font-medium"
          >
            Try it and tell us what is missing
          </button>
        </div>
      </div>
    </section>
  );
}
