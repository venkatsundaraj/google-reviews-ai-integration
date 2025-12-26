import { cn } from "@/lib/utils";
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useMemo,
} from "react";
import { useDropzone, Accept } from "react-dropzone";
import { toast } from "sonner";

export type FileUploadContextType = {
  isDragging: boolean;
  multiple?: boolean;
  open: () => void;
};

export const FileUploadContext = createContext<FileUploadContextType | null>({
  isDragging: false,
  open: () => {},
});

//this part is only for dragging the images from somewhere
const ACCEPTED_FILE_FORMAT: Accept = {
  "image/jpg": [],
  "image/png": [],
  "image/jpeg": [],
};

export type FileUploadProps = {
  onFilesAdded: (files: File[]) => void;
  children: React.ReactNode;
  multiple: boolean;
  accept?: string;
};

export const FileUpload = function ({
  children,
  multiple = false,
  onFilesAdded,
  accept,
}: FileUploadProps) {
  const { getInputProps, getRootProps, isDragActive, open, acceptedFiles } =
    useDropzone({
      accept: ACCEPTED_FILE_FORMAT,
      onDrop: (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
          const unsupportedFile = rejectedFiles.map(({ file }) => file.name);
          toast.error(
            `Unsupported file type${
              rejectedFiles.length > 1 ? "s" : ""
            }: ${unsupportedFile.join(
              ", "
            )}. Only image and text files are allowed.`
          );
          return;
        }
        if (acceptedFiles.length > 0) {
          onFilesAdded(acceptedFiles);
        }
      },
      multiple,
      noClick: true,
      noKeyboard: true,
    });

  const value = useMemo(
    () => ({ isDragging: isDragActive, open }),
    [isDragActive, open]
  );
  return (
    <FileUploadContext.Provider value={value}>
      <div {...getRootProps()} className="">
        <input {...getInputProps()} />
        {children}
      </div>
    </FileUploadContext.Provider>
  );
};

type FileUploadTriggerProps = React.ComponentPropsWithRef<"button"> & {
  asChild?: boolean;
};
export const FileUploadTrigger = function ({
  children,
  asChild = false,
  className,
  ...props
}: FileUploadTriggerProps) {
  const context = useContext(FileUploadContext);
  const isOpen = () => context?.open();

  if (asChild) {
    const child = Children.only(children) as React.ReactElement<
      React.HtmlHTMLAttributes<HTMLElement>
    >;
    cloneElement(child, {
      ...props,
      className: cn(className, child.props.className),
      onClick: (e) => {
        e.stopPropagation();
        isOpen();
        child.props.onClick?.(e as React.MouseEvent<HTMLElement>);
      },
    });
  }

  // if(context.)
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        e.stopPropagation();

        isOpen();
      }}
      {...props}
    >
      {children}
    </button>
  );
};
