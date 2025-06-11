import { Mark, mergeAttributes } from "@tiptap/core";

export const CommentMark = Mark.create({
  name: "comment",
  addOptions() {
    return { HTMLAttributes: {} };
  },
  addAttributes() {
    return { id: { default: null } };
  },
  parseHTML() {
    return [{ tag: "span[data-comment]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-comment": HTMLAttributes.id,
        class: "bg-yellow-200",
      }),
      0,
    ];
  },
});
