import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-sm animate-pulse"></div>
          </div>
        </div>
      </div>
    ),
    title: "Explore Possibilities",
    description:
      "Map out the full possibility space before committing to a solution. Consider trade-offs and alternatives systematically.",
  },
  {
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div
              className="w-2 h-2 bg-white rounded-sm animate-pulse"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/70 rounded-sm animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white/70 rounded-sm animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-sm animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>
      </div>
    ),
    title: "Real Engineering Docs",
    description:
      "Generate architecture docs, ADRs, RFCs, and PRDs that are actually useful for development, not just for show.",
  },
  {
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
          <div className="relative">
            <div
              className="w-6 h-6 border-2 border-white rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>
            <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    ),
    title: "AI-Optimized Specs",
    description:
      "Create documentation specifically designed to guide AI coding tools like Cursor and Claude Code for maximum effectiveness.",
  },
  {
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
          <div className="flex flex-col space-y-1">
            <div className="flex space-x-1">
              <div
                className="w-1 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <div className="flex space-x-1">
              <div
                className="w-2 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="w-1 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="w-2 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
            <div className="flex space-x-1">
              <div
                className="w-1 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "1.2s" }}
              ></div>
              <div
                className="w-2 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "1.4s" }}
              ></div>
              <div
                className="w-1 h-1 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "1.6s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    ),
    title: "Comprehensive Planning",
    description:
      "30 minutes of planning saves 3 days of refactoring. Identify edge cases and potential issues before they become problems.",
  },
  {
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
          <div className="relative">
            <div className="w-5 h-5 border-2 border-white rounded-full"></div>
            <div className="absolute top-1.5 left-1.5 w-2 h-2 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    ),
    title: "Human-in-the-Loop",
    description:
      "Review, refine, and add your insights. Make the plans your own with our collaborative interface.",
  },
  {
    icon: (
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-xl flex items-center justify-center">
          <div className="relative">
            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 bg-gradient-to-br from-[#1B9847] to-[#158039] rounded"></div>
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            <div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </div>
      </div>
    ),
    title: "Accelerated Thinking",
    description:
      "Let AI help you think through complex problems without replacing your judgment or expertise.",
  },
];

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-b from-neutral-50 to-neutral-100"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Stop Building.{" "}
            <span className="bg-gradient-to-r from-[#1B9847] to-[#158039] bg-clip-text text-transparent">
              Start Planning.
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            When given the right instructions, AI is incredibly powerful.
            Compose helps you create those instructions.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-white rounded-xl p-6 shadow-sm border border-neutral-200 hover:shadow-lg hover:border-[#1B9847]/20 transition-all duration-300"
              variants={itemVariants}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="mb-4"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.2 },
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900 group-hover:text-neutral-800 transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutral-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 bg-white rounded-xl p-8 shadow-md border border-neutral-200 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1B9847]/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">
                Why Engineers Choose Compose
              </h3>
              <p className="text-neutral-600 mb-6">
                Thoughtful planning is your competitive advantage. Don't just
                build the first thing that comes to mind.
              </p>
              <ul className="space-y-3">
                {[
                  "Avoid discovering major design flaws after you've already built it",
                  "Explore alternatives before committing to a solution",
                  "Create documentation that actually guides development",
                  "Optimize your AI coding sessions with clear specifications",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-neutral-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 lg:h-auto">
              <motion.div
                className="absolute inset-0 bg-white 2xl:bg-gradient-to-br 2xl:from-[#1B9847]/10 2xl:via-neutral-100/50 2xl:to-[#1B9847]/5 rounded-lg flex items-center justify-center 2xl:border 2xl:border-[#1B9847]/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center p-6">
                  <motion.h4
                    className="text-xl font-bold text-neutral-900 mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    "Finally stopped building features I had to completely
                    rewrite"
                  </motion.h4>
                  <motion.p
                    className="text-neutral-700 italic"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    — Senior Engineer, AI Startup
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
