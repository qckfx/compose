import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewDoc from "@/pages/NewDoc";
import DocView from "@/pages/DocView";
import DocNotFound from "@/pages/DocNotFound";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <SignedIn>
        <BrowserRouter>
          <Routes>
            <Route path="/new" element={<NewDoc />} />
            <Route path="/doc/:id" element={<DocView />} />
            <Route path="/not-found" element={<DocNotFound />} />
            <Route path="*" element={<Navigate to="/new" replace />} />
          </Routes>
        </BrowserRouter>
      </SignedIn>
      <SignedOut>
        <div className="flex justify-center items-center h-screen">
          <SignIn />
        </div>
      </SignedOut>
      <Toaster position="top-center" richColors />
    </>
  );
}
