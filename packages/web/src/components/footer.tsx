import { Github, Twitter, Linkedin } from "lucide-react";
import { useFeatureFlagEnabled } from "posthog-js/react";

export default function Footer() {
  const showPricing = useFeatureFlagEnabled("show-pricing");
  const showLegal = useFeatureFlagEnabled("show-legal");

  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="flex items-center mb-4">
              <div className="relative">
                <span className="text-2xl font-bold text-white">Compose</span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#1B9847] to-transparent"></div>
              </div>
            </a>
            <p className="mb-4 max-w-md">
              Your planning copilot that generates technical documentation
              designed for AI consumption and helps engineers at early stage
              startups think through complex problems.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/qckfx_"
                className="hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/qckfx"
                className="hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/company/qckfx"
                className="hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              {showPricing && (
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              )}
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://qckfx.com/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="mailto:chris.wood@qckfx.com"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>
            &copy; {new Date().getFullYear()} qckfx, Inc. All rights reserved.
          </p>
          {showLegal && (
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
