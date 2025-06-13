import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#1B9847]/20 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-6 sm:px-8">
        {/* Logo */}
        <Link
          to="/new"
          className="text-lg font-semibold leading-none tracking-tight text-[#1B9847] transition-colors hover:text-[#14843b] sm:text-xl"
        >
          qckfx
        </Link>

        {/* Spacer to push account button right */}
        <div className="ml-auto">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "h-9 w-9" } }}
          />
        </div>
      </div>
    </header>
  );
}
