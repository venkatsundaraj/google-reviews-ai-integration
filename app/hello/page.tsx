"use client";

import { FC, useState, useEffect, useRef } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [value, setValue] = useState<number>(0);
  const numRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setInterval(
      () => (numRef.current = numRef.current + 1),
      //   () => setValue((val) => val + 1),
      1000
    );
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log(value);
  }, [value]);

  return (
    <div className="flex w-screen h-screen overflow-hidden items-center justify-center flex-col gap-6">
      <span>{value}</span>
      <button
        onClick={() => {
          setValue(0);
          if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
      >
        stop
      </button>
      <button onClick={() => console.log(numRef.current)}>get</button>
    </div>
  );
};

export default page;
