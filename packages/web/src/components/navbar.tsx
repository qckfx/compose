import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useFeatureFlagEnabled } from "posthog-js/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const showPricing = useFeatureFlagEnabled("show-pricing");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 bg-white border-b border-neutral-100 ${
        scrolled ? "shadow-sm" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="relative">
                <span className="text-2xl font-bold text-neutral-900">
                  Compose
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#1B9847] to-transparent"></div>
              </div>
            </a>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#features"
                  className="text-neutral-600 hover:text-neutral-800 transition-all duration-300 relative group"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1B9847] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  className="text-neutral-600 hover:text-neutral-800 transition-all duration-300 relative group"
                >
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1B9847] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-neutral-600 hover:text-neutral-800 transition-all duration-300 relative group"
                >
                  Testimonials
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1B9847] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              {showPricing && (
                <li>
                  <a
                    href="#pricing"
                    className="text-neutral-600 hover:text-neutral-800 transition-all duration-300 relative group"
                  >
                    Pricing
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1B9847] transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div className="hidden md:block">
            <SignInButton>
              <Button variant="outline" className="mr-4">
                Log In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-[#1B9847] hover:bg-[#158039] text-white">
                Get Started
              </Button>
            </SignUpButton>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 text-neutral-600 hover:text-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#workflow"
              className="block px-3 py-2 text-neutral-600 hover:text-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 text-neutral-600 hover:text-neutral-800"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            {showPricing && (
              <a
                href="#pricing"
                className="block px-3 py-2 text-neutral-600 hover:text-neutral-800"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </a>
            )}
            <div className="pt-4 flex flex-col space-y-2">
              <SignInButton>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="w-full bg-[#1B9847] hover:bg-[#158039] text-white">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
