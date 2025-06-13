import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code, FileText, Lightbulb } from "lucide-react";
import { SignUpButton } from "@clerk/clerk-react";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-gradient-to-r from-[#1B9847]/10 to-[#1B9847]/5 text-[#1B9847] text-sm font-medium mb-6 border border-[#1B9847]/20">
              For Engineers Who Value Thoughtful Planning
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-neutral-900">
              Stop Rushing Into Code.{" "}
              <span className="bg-gradient-to-r from-[#1B9847] to-[#158039] bg-clip-text text-transparent">
                Think First.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-lg">
              Your planning copilot that generates technical documentation
              designed for AI consumption and helps you explore the full
              possibility space before writing a single line of code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <SignUpButton>
                <Button className="bg-gradient-to-r from-[#1B9847] to-[#158039] hover:from-[#158039] hover:to-[#1B9847] text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Planning Better
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <Button
                variant="outline"
                className="text-lg px-8 py-6 h-auto"
                onClick={() => {
                  document
                    .getElementById("workflow")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See How It Works
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm text-neutral-500">
              <span className="flex items-center mr-6">
                <svg
                  className="w-5 h-5 mr-2 text-[#1B9847]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </span>
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-[#1B9847]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Free early access
              </span>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10 bg-white rounded-xl shadow-xl border border-neutral-200 p-6 transform rotate-1">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-[#1B9847] mr-2" />
                <h3 className="font-semibold text-lg">
                  Architecture Decision Record
                </h3>
              </div>
              <div className="space-y-3 text-sm text-neutral-700">
                <p className="font-medium">
                  Decision: Use GraphQL for API Layer
                </p>
                <p>
                  Context: Our application needs to support multiple clients
                  with varying data requirements.
                </p>
                <p>Considerations:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    REST would require multiple endpoints or over-fetching
                  </li>
                  <li>GraphQL provides flexible queries and strong typing</li>
                  <li>Performance concerns can be mitigated with caching</li>
                </ul>
                <p className="font-medium text-[#1B9847]">
                  Trade-offs analyzed: 3
                </p>
              </div>
            </div>

            <div className="absolute top-20 -right-10 z-0 bg-white rounded-xl shadow-xl border border-neutral-200 p-6 transform -rotate-2">
              <div className="flex items-center mb-4">
                <Code className="h-6 w-6 text-[#1B9847] mr-2" />
                <h3 className="font-semibold text-lg">Implementation Plan</h3>
              </div>
              <div className="space-y-2 text-sm text-neutral-700">
                <p>1. Set up Apollo Server with Express</p>
                <p>2. Define core schema types</p>
                <p>3. Implement resolvers with DataLoader</p>
                <p className="font-medium text-[#1B9847]">
                  Edge cases identified: 4
                </p>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-5 z-20 bg-white rounded-xl shadow-xl border border-neutral-200 p-6 transform rotate-3">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-6 w-6 text-[#1B9847] mr-2" />
                <h3 className="font-semibold text-lg">
                  Alternative Approaches
                </h3>
              </div>
              <div className="space-y-2 text-sm text-neutral-700">
                <p>• REST with specialized endpoints</p>
                <p>• gRPC for service-to-service</p>
                <p className="font-medium text-[#1B9847]">
                  Alternatives explored: 3
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
