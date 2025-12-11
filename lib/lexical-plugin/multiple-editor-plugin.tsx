"use client";
import { useEditor, useEditors } from "@/hooks/use-editor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export type MultipleEditorStorePluginProps = {
  id: string;
};

export const MultipleEditorPlugin = function (
  props: MultipleEditorStorePluginProps
) {
  const { id } = props;

  const [editor] = useLexicalComposerContext();

  const editors = useEditors();

  useEffect(() => {
    editors.createEditor(id, editor);
    return () => editors.deleteEditor(id);
  }, [editor, id]);

  return null;
};
