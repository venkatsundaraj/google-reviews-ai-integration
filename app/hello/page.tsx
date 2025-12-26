"use client";

import { FC } from "react";
import { Button } from "../_components/ui/button";
import { Icons } from "../_components/miscellaneous/icons";
import { useDropzone } from "react-dropzone";
import { Input } from "../_components/ui/input";
import { cn } from "@/lib/utils";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { getInputProps, getRootProps, open, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, rejectedFiles) => {
      console.log(acceptedFiles);
    },
    noKeyboard: true,
    noClick: true,
    multiple: true,
  });
  return (
    <div className="w-screen h-screen items-center justify-center flex">
      <div
        {...getRootProps()}
        className={cn(
          "flex items-center justify-center relative  h-32 border border-accent w-full max-w-md",
          isDragActive ? "border-dotted border-primary" : ""
        )}
      >
        <input {...getInputProps()} />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="absolute bottom-1.5 left-1.5"
        >
          <Icons.ChevronDown className="rotate-180" />
        </Button>
      </div>
    </div>
  );
};

export default page;

////////////////////////////
// import { cn } from "@/lib/utils";
// import { FC, useEffect, Children, ReactNode, cloneElement } from "react";

// interface pageProps extends React.ComponentPropsWithoutRef<"button"> {
//   children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
//   asChild?: boolean;
// }

// function Hello({ children, asChild, ...props }: pageProps) {
//   useEffect(() => {
//     // Children.forEach(children, (ch) => {
//     //   if (ch.type === "button") {
//     //     console.log("button");
//     //   } else {
//     //     console.log(ch.type);
//     //   }
//     // });
//   }, []);
//   const handleClick = () => {
//     console.log(true);
//   };
//   if (asChild) {
//     const child = Children.only(children) as React.ReactElement<
//       React.HTMLAttributes<HTMLElement>
//     >;
//     // Children.map(child, (ch) => {
//     //   console.log(ch);

//     // });

//     return cloneElement(child, {
//       role: "button",
//       onClick: (e) => {
//         // e.stopPropagation();
//         console.log(true);
//         handleClick();
//         child.props.onClick?.(e as React.MouseEvent<HTMLElement>);
//       },
//     });
//   }

//   return (
//     <>
//       {/* {children} */}
//       <button>hello world</button>
//     </>
//   );
// }

// const page: FC<pageProps> = ({}) => {
//   // function handler() {
//   //   console.log("hello");
//   // }
//   return (
//     <Hello>
//       <div>hellow</div>
//     </Hello>
//   );
// };

// export default page;
// interface HiProps extends React.ComponentPropsWithoutRef<"button"> {}
// function Hi({}: HiProps) {
//   return <div>hello</div>;
// }

////////////////////////////////////
// import { FC, useState, useEffect, useRef } from "react";

// interface pageProps {}

// const page: FC<pageProps> = ({}) => {
//   const [value, setValue] = useState<number>(0);
//   const numRef = useRef<number>(0);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     timeoutRef.current = setInterval(
//       () => (numRef.current = numRef.current + 1),
//       //   () => setValue((val) => val + 1),
//       1000
//     );
//     return () => {
//       if (timeoutRef.current) {
//         clearInterval(timeoutRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     console.log(value);
//   }, [value]);

//   return (
//     <div className="flex w-screen h-screen overflow-hidden items-center justify-center flex-col gap-6">
//       <span>{value}</span>
//       <button
//         onClick={() => {
//           setValue(0);
//           if (timeoutRef.current) {
//             clearInterval(timeoutRef.current);
//             timeoutRef.current = null;
//           }
//         }}
//       >
//         stop
//       </button>
//       <button onClick={() => console.log(numRef.current)}>get</button>
//     </div>
//   );
// };

// export default page;
