import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";

export default function Workflow() {
  const showWorkflowVideo = useFeatureFlagEnabled("show-workflow-video");

  const steps = useMemo(
    () => [
      {
        icon: (
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-full animate-pulse"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-white bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        ),
        title: "Connect & Describe",
        description:
          "Describe your project, connect your codebase, or upload existing docs. Minimal input required to get started.",
        color: "#1B9847",
      },
      {
        icon: (
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2A9D5C] to-[#1B9847] rounded-xl flex items-center justify-center">
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-lg">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-gradient-to-br from-[#2A9D5C] to-[#1B9847] rounded-full animate-ping"></div>
                  <div className="absolute top-2 left-1 w-3 h-0.5 bg-gradient-to-r from-[#2A9D5C] to-transparent rounded-full"></div>
                  <div className="absolute top-3 left-1 w-2 h-0.5 bg-gradient-to-r from-[#2A9D5C] to-transparent rounded-full"></div>
                  <div className="absolute top-4 left-1 w-4 h-0.5 bg-gradient-to-r from-[#2A9D5C] to-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ),
        title: "AI Generates Draft",
        description:
          "Our AI analyzes your input and generates comprehensive technical documentation with architecture considerations and alternatives.",
        color: "#2A9D5C",
      },
      {
        icon: (
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#39A271] to-[#2A9D5C] rounded-xl flex items-center justify-center">
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 border border-[#39A271] rounded-sm flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#39A271] rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        ),
        title: "Review & Refine",
        description:
          "Edit the document in our interface. Add your insights. Make it your own with collaborative editing.",
        color: "#39A271",
      },
      {
        icon: (
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#48A786] to-[#39A271] rounded-xl flex items-center justify-center">
              <div className="relative">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div
                      className="w-1 h-1 bg-[#48A786] rounded-full animate-pulse"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-[#48A786] rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-[#48A786] rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-[#48A786] rounded-full animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </div>
                </div>
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        ),
        title: "Hand Off to AI Tools",
        description:
          "Export crystal-clear specs to your AI coding tools like Cursor or Claude Code for maximum effectiveness.",
        color: "#48A786",
      },
    ],
    [],
  );

  const stepRefs = useMemo(() => steps.map(() => ({ current: null })), [steps]);

  return (
    <section id="workflow" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It{" "}
            <span className="bg-gradient-to-r from-[#1B9847] to-[#158039] bg-clip-text text-transparent">
              Works
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A simple, human-in-the-loop process that enhances your thinking
            without replacing it.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-neutral-200 transform -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => {
              const ref = stepRefs[index];

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <div
                    className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}
                  >
                    <h3 className="text-2xl font-bold mb-3 text-neutral-900">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600">{step.description}</p>
                  </div>

                  <motion.div
                    className="my-6 md:my-0 relative"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center z-10 relative shadow-lg bg-white">
                      {step.icon}
                    </div>
                  </motion.div>

                  <div className="w-full md:w-5/12"></div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {showWorkflowVideo && (
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-[#1B9847]/10 text-[#1B9847] mb-6">
              <ArrowRight className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-neutral-900">
              Ready to see it in action?
            </h3>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
              Watch how Compose transforms vague ideas into comprehensive
              technical documentation in minutes.
            </p>
            <div className="relative rounded-xl overflow-hidden shadow-xl border border-neutral-200 max-w-4xl mx-auto">
              <div className="aspect-w-16 aspect-h-9 bg-neutral-100 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#1B9847] flex items-center justify-center cursor-pointer hover:bg-[#158039] transition-colors">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
