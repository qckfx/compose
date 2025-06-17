import { CheckCircle2, AlertCircle } from "lucide-react";

const problems = [
  {
    title: "Writing PRDs for complex features is time-consuming",
    description:
      "You know what needs to be built, but documenting it properly for AI tools takes hours",
    solution:
      "Generate comprehensive PRDs grounded in your actual codebase patterns",
  },
  {
    title: "Claude Code and TaskMaster need detailed requirements",
    description:
      "Vague specs lead to wrong code, bugs, and wasted time debugging AI mistakes",
    solution:
      "Create detailed, structured PRDs that AI tools can parse into actionable tasks",
  },
  {
    title: "Generic PRDs don't understand your codebase",
    description:
      "Writing PRDs without understanding existing patterns leads to inconsistent implementations",
    solution:
      "Our agent reads your code first, then creates PRDs that match your architecture",
  },
  {
    title: "Starting complex features without proper planning",
    description:
      "Jumping into implementation without clear requirements leads to scope creep and technical debt",
    solution:
      "Structured PRDs that break down features into logical, implementable phases",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
            Problems we solve
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            These are the specific pain points our tool addresses. Sound
            familiar?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
            >
              <div className="flex items-start mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  {problem.title}
                </h3>
              </div>
              <p className="text-neutral-600 mb-4 italic text-sm">
                "{problem.description}"
              </p>
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-[#1B9847] mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-neutral-700 font-medium text-sm">
                  {problem.solution}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8 border border-blue-200 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-neutral-900">
              Our AI agent reads your code
            </h3>
            <p className="text-lg text-neutral-700 mb-6">
              We built an agent that works like Claude Code or Codex, but
              specialized for generating technical documents. It browses your
              repo autonomously to understand your patterns and context.{" "}
              <a
                href="https://github.com/qckfx/agent-sdk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1B9847] hover:underline font-medium"
              >
                View the open source repo →
              </a>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm max-w-md mx-auto">
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-mono font-bold text-[#1B9847] text-lg">
                  PRD
                </div>
                <div className="text-neutral-600">
                  Perfect for Claude Code & task-master.dev
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-mono font-bold text-[#1B9847] text-lg">
                  Freestyle
                </div>
                <div className="text-neutral-600">
                  Custom technical documents
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-green-50 rounded-lg p-8 border border-green-200 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-neutral-900">
              📱 Works great on mobile too
            </h3>
            <p className="text-lg text-neutral-700 mb-6">
              Create and edit PRDs on the go. Our mobile-optimized editor lets
              you generate, review, and refine technical documents from your
              phone or tablet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-semibold text-[#1B9847] mb-1">
                  Generate anywhere
                </div>
                <div className="text-neutral-600">
                  Create PRDs while commuting or traveling
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-semibold text-[#1B9847] mb-1">
                  Mobile-optimized editor
                </div>
                <div className="text-neutral-600">
                  Touch-friendly editing with proper text sizing
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border">
                <div className="font-semibold text-[#1B9847] mb-1">
                  Export on the go
                </div>
                <div className="text-neutral-600">
                  Copy to clipboard or download files instantly
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
