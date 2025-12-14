import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { ChatStatus } from "ai";
import { Icons } from "../miscellaneous/icons";

export const LoadingMessage = memo(
  ({ hasImage, status }: { hasImage?: boolean; status?: ChatStatus }) => {
    const [message, setMessage] = useState("Thinking...");

    useEffect(() => {
      if (hasImage) {
        const timer = setTimeout(() => {
          setMessage("Reading image...");
        }, 1000);

        const timer2 = setTimeout(() => {
          setMessage("Processing...");
        }, 2500);

        return () => {
          clearTimeout(timer);
          clearTimeout(timer2);
        };
      }
    }, [hasImage]);

    const isAnimating = status === "streaming" || status === "submitted";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-start gap-1"
      >
        <div className="flex-1 space-y-2">
          <div className="p-3.5 space-y-4 rounded-2xl text-gray-800 rounded-bl-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-base flex items-center justify-start gap-2.5"
            >
              <Icons.LoaderCircle className="w-6 h-6 animate-spin duration-100 stroke-primary" />{" "}
              {message}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }
);

LoadingMessage.displayName = "LoadingMessage";
