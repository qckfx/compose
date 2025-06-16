import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { signIn } = useSignIn();

  const handleAuth = () => {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_github",
      redirectUrl: "/new",
      redirectUrlComplete: "/new",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white/90 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-neutral-900">
                Compose
              </span>
              <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-md font-medium">
                ALPHA
              </span>
            </a>
          </div>

          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#features"
                  className="text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  What it does
                </a>
              </li>
              <li>
                <a
                  href="#workflow"
                  className="text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#feedback"
                  className="text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  Give feedback
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  Early access
                </a>
              </li>
            </ul>
          </nav>

          <div className="hidden md:block">
            <Button variant="outline" className="mr-4" onClick={handleAuth}>
              Sign in
            </Button>
            <Button
              className="bg-[#1B9847] hover:bg-[#158039] text-white"
              onClick={handleAuth}
            >
              Try it (free)
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#features"
              className="block px-3 py-2 text-neutral-700 hover:text-neutral-900"
              onClick={() => setIsOpen(false)}
            >
              What it does
            </a>
            <a
              href="#workflow"
              className="block px-3 py-2 text-neutral-700 hover:text-neutral-900"
              onClick={() => setIsOpen(false)}
            >
              How it works
            </a>
            <a
              href="#feedback"
              className="block px-3 py-2 text-neutral-700 hover:text-neutral-900"
              onClick={() => setIsOpen(false)}
            >
              Give feedback
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-neutral-700 hover:text-neutral-900"
              onClick={() => setIsOpen(false)}
            >
              Early access
            </a>
            <div className="pt-4 flex flex-col space-y-2">
              <Button variant="outline" className="w-full" onClick={handleAuth}>
                Sign in
              </Button>
              <Button
                className="w-full bg-[#1B9847] hover:bg-[#158039] text-white"
                onClick={handleAuth}
              >
                Try it (free)
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
