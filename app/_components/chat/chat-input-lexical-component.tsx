import { FC, useEffect } from "react";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PlaceholderPlugin } from "@/lib/lexical-plugin/place-holder-plugin";
import { MultipleEditorPlugin } from "@/lib/lexical-plugin/multiple-editor-plugin";
import {
  $getRoot,
  KEY_ENTER_COMMAND,
  $createParagraphNode,
  COMMAND_PRIORITY_HIGH,
} from "lexical";
import { useParams } from "next/navigation";
import { useChatContext } from "@/hooks/use-chat";

interface ChatInputLexicalComponentProps {}

const ChatInput = function ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const text = root.getTextContent();
        });
      }
    );

    return () => {
      unregisterListener();
    };
  }, [params.id, editor]);

  useEffect(() => {
    const removeCommand = editor?.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent | null) => {
        if (event && !event.shiftKey) {
          event.preventDefault();

          const text = editor.getEditorState().read(() => {
            const root = $getRoot();
            return root.getTextContent().trim();
          });

          onSubmit(text);

          editor.update(() => {
            const root = $getRoot();

            root.clear();
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          });
        }

        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      removeCommand();
    };
  }, [editor, onSubmit]);
  return (
    <>
      <PlainTextPlugin
        contentEditable={
          <ContentEditable className="w-[400px] h-[150px] overflow-y-scroll ring-2 border border-primary ring-accent rounded-md p-2 focus-within:outline-0" />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      {/* have been used use-editor hook here */}
      <PlaceholderPlugin placeholder="Write Something..." />
      <MultipleEditorPlugin id="app-sidebar" />
    </>
  );
};

const ChatInputLexicalComponent: FC<ChatInputLexicalComponentProps> = ({}) => {
  const { startNewMessage } = useChatContext();
  const submitHandler = function (text: string) {
    startNewMessage(text);
  };
  return <ChatInput onSubmit={submitHandler} />;
};

export default ChatInputLexicalComponent;
