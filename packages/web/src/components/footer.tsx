import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-100 py-12 border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <a href="/" className="flex items-center mb-4">
                <span className="text-xl font-bold text-neutral-900">
                  Compose
                </span>
                <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md font-medium">
                  ALPHA
                </span>
              </a>
              <p className="text-neutral-600 text-sm mb-4">
                Helping engineers think through ideas, create PRDs, prototype,
                and ship faster with AI.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/qckfx_"
                  className="text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="https://github.com/qckfx/agent-sdk"
                  className="text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href="mailto:chris.wood@qckfx.com"
                  className="text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    What it does
                  </a>
                </li>
                <li>
                  <a
                    href="#workflow"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    How it works
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Feedback</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:chris.wood@qckfx.com"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Send feedback
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:chris.wood@qckfx.com"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Feature requests
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:chris.wood@qckfx.com"
                    className="text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    Bug reports
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200 mt-12 pt-8 text-center">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} qckfx, Inc. • Built with
              feedback from engineers like you
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
