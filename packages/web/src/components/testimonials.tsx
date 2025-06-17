const feedback = [
  {
    quote:
      "Saved me 2 hours writing a TaskMaster PRD. The output was better than what I usually write by hand.",
    author: "Sarah",
    role: "Full-stack dev",
    context: "Using for TaskMaster workflows",
  },
  {
    quote:
      "Finally have PRDs that actually understand my codebase architecture. Much better than starting from scratch.",
    author: "Mike",
    role: "Solo founder",
    context: "Planning new features for React app",
  },
  {
    quote:
      "The browser editor makes it easy to tweak the generated PRDs. Perfect for Claude Code workflows.",
    author: "Alex",
    role: "Senior engineer",
    context: "Creating feature specs for team",
  },
];

export default function Testimonials() {
  return (
    <section id="feedback" className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
            Early feedback on PRD generation
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            What engineers are saying about codebase-grounded PRD generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {feedback.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200"
            >
              <p className="text-neutral-700 mb-4 italic">"{item.quote}"</p>
              <div className="border-t pt-4">
                <p className="font-medium text-neutral-900">{item.author}</p>
                <p className="text-sm text-neutral-500">{item.role}</p>
                <p className="text-xs text-neutral-400 mt-1">{item.context}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm border border-neutral-200 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-neutral-900">
              We really want your feedback
            </h3>
            <p className="text-neutral-700 mb-6">
              PRD generation works well, but we want to perfect it for AI coding
              tools like Claude Code & task-master.dev. What matters most to
              you?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-left bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">What we want to know:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Do PRDs save you time vs. writing by hand?</li>
                  <li>• How well do PRDs work with Claude Code?</li>
                  <li>• Are PRDs detailed enough for task-master.dev?</li>
                  <li>• What would make PRD generation essential?</li>
                </ul>
              </div>
              <div className="text-left bg-neutral-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Any and all feedback:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>
                    • Email:{" "}
                    <a
                      href="mailto:chris.wood@qckfx.com"
                      className="text-[#1B9847] hover:underline"
                    >
                      chris.wood@qckfx.com
                    </a>
                  </li>
                  <li>
                    • Twitter:{" "}
                    <a
                      href="https://x.com/qckfx_"
                      className="text-[#1B9847] hover:underline"
                    >
                      @qckfx_
                    </a>
                  </li>
                  <li>• We read everything and respond</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
