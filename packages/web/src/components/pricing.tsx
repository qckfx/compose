import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Perfect for individual engineers or small projects",
    features: [
      "5 projects per month",
      "Architecture Decision Records",
      "Implementation Plans",
      "Export to Markdown",
      "Basic AI coding tool integration",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For engineers who value comprehensive planning",
    features: [
      "Unlimited projects",
      "All document types (ADRs, RFCs, PRDs)",
      "Advanced AI tool integration",
      "Team collaboration",
      "Version history",
      "Custom templates",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For engineering teams that need to align",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Advanced permissions",
      "SSO authentication",
      "API access",
      "Priority support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
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
      id="pricing"
      className="py-20 bg-gradient-to-b from-neutral-100 to-neutral-50"
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
            Simple,{" "}
            <span className="bg-gradient-to-r from-[#1B9847] to-[#158039] bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </motion.h2>
          <motion.p
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Lock in early adopter pricing now. All plans include a 14-day free
            trial.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-xl overflow-hidden relative group ${
                plan.popular
                  ? "border-2 border-[#1B9847] shadow-xl bg-gradient-to-b from-white to-[#1B9847]/5"
                  : "border border-neutral-200 shadow-lg bg-white hover:shadow-xl"
              } transition-all duration-300`}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              {plan.popular && (
                <motion.div
                  className="bg-gradient-to-r from-[#1B9847] to-[#158039] text-white text-center py-2 text-sm font-medium relative overflow-hidden"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Sparkles className="inline-block w-4 h-4 mr-1" />
                  Most Popular
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                </motion.div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <motion.span
                    className="text-4xl font-bold text-neutral-900"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {plan.price}
                  </motion.span>
                  <span className="text-neutral-500 ml-1">{plan.period}</span>
                </div>
                <p className="text-neutral-600 mb-6">{plan.description}</p>
                <Button
                  className={`w-full transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#1B9847] to-[#158039] hover:from-[#158039] hover:to-[#1B9847] text-white shadow-lg hover:shadow-xl"
                      : "bg-white text-neutral-900 border-2 border-neutral-300 hover:border-[#1B9847] hover:bg-[#1B9847]/5"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>

              <div className="bg-neutral-50 p-6 border-t border-neutral-100">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <div className="bg-gradient-to-br from-[#1B9847] to-[#158039] rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-neutral-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B9847]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-neutral-500">
            Need a custom plan for your enterprise?{" "}
            <a
              href="#"
              className="font-medium bg-gradient-to-r from-[#1B9847] to-[#158039] bg-clip-text text-transparent hover:underline"
            >
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
