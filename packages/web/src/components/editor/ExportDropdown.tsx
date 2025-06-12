import { Editor } from "@tiptap/react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

interface ExportDropdownProps {
  editor: Editor;
}

export default function ExportDropdown({ editor }: ExportDropdownProps) {
  const [selected, setSelected] = useState<string>("copy");

  const optionMeta: Record<string, { label: string; icon: React.ReactNode }> = {
    copy: { label: "Copy as Markdown", icon: <Copy className="w-4 h-4" /> },
    md: { label: "Download as .md", icon: <Download className="w-4 h-4" /> },
    txt: { label: "Download as .txt", icon: <Download className="w-4 h-4" /> },
  };

  const handleExport = (type: string) => {
    const content = editor.storage.markdown?.getMarkdown?.() as string;
    if (!content) return;

    switch (type) {
      case "copy":
        navigator.clipboard.writeText(content).then(() => {
          toast.success("Copied markdown to clipboard");
        });
        break;
      case "md":
        downloadFile(content, "document.md", "text/markdown");
        break;
      case "txt":
        downloadFile(content, "document.txt", "text/plain");
        break;
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="inline-flex items-stretch border rounded-md shadow-sm overflow-hidden">
      <Button
        type="button"
        variant="outline"
        className="rounded-none rounded-l-md px-3 inline-flex items-center gap-2"
        onClick={() => handleExport(selected)}
      >
        {optionMeta[selected].icon}
        <span>{optionMeta[selected].label}</span>
      </Button>
      <Select value={selected} onValueChange={(val) => setSelected(val)}>
        <SelectTrigger
          className="w-9 px-0 justify-center rounded-none rounded-r-md"
          aria-label="Export options"
        >
          {/* No value text, only arrow icon */}
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="copy" className="flex items-center gap-2">
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy as Markdown</span>
          </SelectItem>
          <SelectItem value="md" className="flex items-center gap-2">
            <Download className="w-4 h-4 mr-2" />
            <span>Download as .md</span>
          </SelectItem>
          <SelectItem value="txt" className="flex items-center gap-2">
            <Download className="w-4 h-4 mr-2" />
            <span>Download as .txt</span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
