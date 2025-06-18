import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Landing from "@/pages/Landing";
import SSOCallback from "@/components/SSOCallback";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const NewDoc = lazy(() => import("@/pages/NewDoc"));
const DocView = lazy(() => import("@/pages/DocView"));
const DocNotFound = lazy(() => import("@/pages/DocNotFound"));

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
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/new" element={<NewDoc />} />
                      <Route path="/doc/:id" element={<DocView />} />
                      <Route path="/not-found" element={<DocNotFound />} />
                      <Route
                        path="*"
                        element={<Navigate to="/new" replace />}
                      />
                    </Routes>
                  </Suspense>
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
