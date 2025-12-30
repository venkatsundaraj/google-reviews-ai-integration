"use client";

import { FC, useCallback, useContext, useEffect } from "react";
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
import { Icons } from "../miscellaneous/icons";
import MessageSection from "./message-section";
import {
  FileUpload,
  FileUploadContext,
  FileUploadTrigger,
} from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useAttachment } from "@/hooks/use-attachments";

interface ChatInputLexicalComponentProps {}

const ChatInput = function ({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const params = useParams<{ id: string }>();
  const context = useContext(FileUploadContext);

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

  const handleSubmit = () => {
    const text = editor.read(() => $getRoot().getTextContent().trim());
    onSubmit(text);
    return editor.update(() => {
      const root = $getRoot();
      root.clear();
      root.append($createParagraphNode());
    });
  };

  return (
    <div
      className={cn(
        "w-full max-w-4xl  flex items-center justify-center relative mt-2",
        context?.isDragging &&
          "bg-primary/10 rounded-2xl border border-dotted border-primary"
      )}
    >
      {context?.isDragging && (
        <div className="absolute rounded-2xl top-1/2 z-10 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <span className="text-primary font-heading font-normal text-subtitle-heading leading-normal tracking-normal">
            Please drag and drop here
          </span>
        </div>
      )}
      <div className="w-4xl z-10 relative ">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className=" 4xl h-[100px] overflow-y-scroll ring-2 border border-primary ring-accent rounded-2xl p-2 focus-within:outline-0" />
          }
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={
            <div className="pointer-events-none absolute top-3 left-3 text-muted-foreground z-0 ">
              Write something…
            </div>
          }
        />
        <HistoryPlugin />
        {/* have been used use-editor hook here */}
        <PlaceholderPlugin placeholder="Write Something..." />
        <MultipleEditorPlugin id="app-sidebar" />
      </div>
      <div className="z-10   absolute bottom-0 left-0  flex items-end justify-start">
        {/* <FileUpload multiple={true} onFilesAdded={handleFileAdded}> */}
        <FileUploadTrigger className="hidden items-center justify-center group translate-x-1 -translate-y-1 cursor-pointer w-8 h-8 ">
          <Icons.Paperclip className="w-4 h-4 group-hover:stroke-primary" />
        </FileUploadTrigger>
        {/* </FileUpload> */}
      </div>
      <div className="w-4xl h-[100px] absolute  flex items-end justify-end">
        <button
          onClick={handleSubmit}
          className="-translate-x-1/3 z-11 -translate-y-1/3 w-10 h-10 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90"
        >
          <Icons.ChevronDown className="rotate-180 stroke-white" />
        </button>
      </div>
    </div>
  );
};

const ChatInputLexicalComponent: FC<ChatInputLexicalComponentProps> = ({}) => {
  const { addAttachment } = useAttachment();
  const { startNewMessage, messages, status } = useChatContext();
  const params = useParams<{ id: string }>();
  const handleSubmit = useCallback(
    async function (text: string) {
      if (!text.trim()) return;
      startNewMessage(text);
    },
    [messages]
  );

  const handleFileAdded = useCallback((file: File[]) => {
    addAttachment(file);
  }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-end py-4">
      {messages.length && params.id ? (
        <MessageSection messages={messages} status={status} />
      ) : (
        <h1 className="flex-1 flex items-center justify-center font-heading text-primary-heading text-primary  font-bold leading-normal">
          What's on your mind?
        </h1>
      )}
      {/* {!messages.length && !params.id ? <h1>hello world</h1> : null} */}
      <FileUpload multiple={true} onFilesAdded={handleFileAdded}>
        <ChatInput onSubmit={handleSubmit} />
      </FileUpload>
    </div>
  );
};

export default ChatInputLexicalComponent;
