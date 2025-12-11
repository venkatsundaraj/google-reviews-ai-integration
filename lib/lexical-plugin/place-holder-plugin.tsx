import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalIsTextContentEmpty } from "@lexical/react/useLexicalIsTextContentEmpty";
import { useEffect } from "react";

export const PlaceholderPlugin = function ({
  placeholder = "Start Typing...",
}: {
  placeholder: string;
}) {
  const [editor] = useLexicalComposerContext();
  const isEmpty = useLexicalIsTextContentEmpty(editor);

  useEffect(() => {
    const element = editor.getRootElement();
    if (!element) return;

    const update = function () {
      if (isEmpty) {
        element.style.setProperty("--placeholder", `"${placeholder}"`);
        element.classList.add("show-placeholder");
      } else {
        element.classList.remove("show-placeholder");
      }
    };
    update();
    return editor.registerUpdateListener(() => {
      update;
    });
  }, [isEmpty, editor, placeholder]);
  return null;
};
