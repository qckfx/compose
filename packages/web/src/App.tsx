import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewDoc from "@/pages/NewDoc";
import DocView from "@/pages/DocView";
import DocNotFound from "@/pages/DocNotFound";
import Landing from "@/pages/Landing";
import SSOCallback from "@/components/SSOCallback";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sso-callback" element={<SSOCallback />} />
          <Route
            path="/*"
            element={
              <>
                <SignedIn>
                  <Routes>
                    <Route path="/new" element={<NewDoc />} />
                    <Route path="/doc/:id" element={<DocView />} />
                    <Route path="/not-found" element={<DocNotFound />} />
                    <Route path="*" element={<Navigate to="/new" replace />} />
                  </Routes>
                </SignedIn>
                <SignedOut>
                  <Landing />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </>
  );
}
