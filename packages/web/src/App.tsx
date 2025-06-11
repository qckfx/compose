import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewDoc from "@/pages/NewDoc";
import DocView from "@/pages/DocView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/new" element={<NewDoc />} />
        <Route path="/doc/:id" element={<DocView />} />
        <Route path="*" element={<Navigate to="/new" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
