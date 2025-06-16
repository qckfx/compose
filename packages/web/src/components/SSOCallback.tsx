import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-white rounded-full shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B9847]"></div>
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Setting up your account
        </h2>
        <p className="text-neutral-600">
          We're getting everything ready for you...
        </p>
        <div className="mt-8 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#1B9847] rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-[#1B9847] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#1B9847] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
