export default function TipTapEditor({
  initialContent,
}: {
  docId: string;
  initialContent: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mt-6">Draft</h2>
      <textarea
        value={initialContent}
        className="p-3 border w-full h-full rounded bg-gray-50"
      />
    </div>
  );
}
