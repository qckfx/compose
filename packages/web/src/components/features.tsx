import { CheckCircle2, AlertCircle } from "lucide-react";

const problems = [
  {
    title: "Writing .cursorrules by hand is tedious",
    description:
      "You know what patterns you use, but explaining them clearly to Cursor takes forever",
    solution: "Our agent reads your code and writes the .cursorrules for you",
  },
  {
    title: "TaskMaster needs a PRD for every run",
    description:
      "Bad PRDs = bad output. Writing good PRDs by hand is time-consuming and error-prone.",
    solution: "Generate TaskMaster PRDs from your codebase context in minutes",
  },
  {
    title: "Cursor does not understand your codebase yet",
    description:
      "Asking Cursor to generate your .cursorrules will not work - it does not know your patterns",
    solution:
      "Our tool is designed exactly for this: reading code to create documentation",
  },
  {
    title: "Bad documentation causes AI hallucinations",
    description:
      "Vague specs lead to wrong code, bugs, and wasted time debugging AI mistakes",
    solution:
      "Better docs because our agent actually understands your implementation",
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border">
                <div className="font-mono font-bold text-[#1B9847]">
                  .cursorrules
                </div>
                <div className="text-neutral-600">For Cursor IDE</div>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <div className="font-mono font-bold text-[#1B9847]">
                  TaskMaster PRD
                </div>
                <div className="text-neutral-600">For task-master.dev</div>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <div className="font-mono font-bold text-[#1B9847]">ADRs</div>
                <div className="text-neutral-600">Architecture decisions</div>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <div className="font-mono font-bold text-[#1B9847]">RFCs</div>
                <div className="text-neutral-600">Feature specs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
