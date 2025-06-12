import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewDoc from "@/pages/NewDoc";
import DocView from "@/pages/DocView";
import DocNotFound from "@/pages/DocNotFound";
import InstallGitHubApp from "@/pages/InstallGithubApp";
import { AuthProvider } from "./context/authContext";
import PrivateRoute from "./components/auth/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/new" element={
              <PrivateRoute>
                <NewDoc />
              </PrivateRoute>} />
            <Route path="/doc/:id" element={
              <PrivateRoute>
                <DocView />
              </PrivateRoute>} />
            <Route path="/not-found" element={
              <PrivateRoute>
                <DocNotFound />
              </PrivateRoute>} />
            <Route path="/install" element={
              <PrivateRoute>
                <InstallGitHubApp />
              </PrivateRoute>} />
          <Route path="*" element={
            <PrivateRoute>
              <Navigate to="/new" replace />
            </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
