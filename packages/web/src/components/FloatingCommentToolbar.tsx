import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

export default function FloatingCommentToolbar({
  editor,
  docId,
}: {
  editor: Editor;
  docId: string;
}) {
  const [selection, setSel] = useState<{ from: number; to: number } | null>(
    null,
  );

  useEffect(() => {
    editor?.on("selectionUpdate", ({ editor }: { editor: Editor }) => {
      const { from, to } = editor.state.selection;
      setSel(from === to ? null : { from, to });
    });
  }, [editor]);

  if (!selection) return null;
  const coords = editor.view.coordsAtPos(selection.to);

  return (
    <div
      style={{ position: "absolute", top: coords.top - 40, left: coords.left }}
      className="bg-white border p-1 rounded shadow"
    >
      <button
        onClick={async () => {
          const body = prompt("Comment?");
          if (!body) return;
          const res = await fetch(`/api/doc/${docId}/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              body,
              start: selection.from,
              end: selection.to,
            }),
          });
          const comment = await res.json();
          editor
            .chain()
            .setTextSelection({ from: selection.from, to: selection.to })
            .setMark("comment", { id: comment.id })
            .run();
          setSel(null);
        }}
      >
        💬
      </button>
    </div>
  );
}
