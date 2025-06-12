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
  const startCoords = editor.view.coordsAtPos(selection.from);
  const endPos = Math.max(selection.to - 1, selection.from);
  const endCoords = editor.view.coordsAtPos(endPos);

  const topMost = Math.min(startCoords.top, endCoords.top);
  const centerX = (startCoords.left + endCoords.right) / 2;

  return (
    <div
      style={{
        position: "absolute",
        top: topMost - 40,
        left: centerX,
        transform: "translateX(-50%)",
      }}
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
        className="px-2 py-1 text-sm text-gray-800 hover:text-gray-900 hover:bg-gray-100 rounded"
      >
        Comment
      </button>
    </div>
  );
}
