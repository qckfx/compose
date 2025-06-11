import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TipTapEditor from "@/components/TipTapEditor";

export default function DocView() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState("Loading…");
  const navigate = useNavigate();

  // ❶ fetch persisted content once
  useEffect(() => {
    let cancelled = false;

    fetch(`/api/doc/${id}`)
      .then(async (r) => {
        if (r.status === 404) {
          navigate("/not-found", { replace: true });
          throw new Error("not-found");
        }
        return r.json();
      })
      .then((d) => {
        if (!cancelled) {
          setContent(d.content ?? "");
        }
      })
      .catch((err) => {
        // Swallow navigation-triggered error or display generic message
        console.error(err);
        if (err.message !== "not-found" && !cancelled) {
          setContent("Failed to load document");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  return (
    <div className="p-4 sm:p-8 w-full h-full flex flex-col gap-4">
      <TipTapEditor docId={id!} initialContent={content} />
    </div>
  );
}
