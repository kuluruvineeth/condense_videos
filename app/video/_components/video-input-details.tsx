import { bytesToSize } from "@/utils/bytesToSize";
import { FileActions } from "@/utils/types";
import { motion } from "framer-motion";

export const VideoInputDetails = ({
  videoFile,
  onClear,
}: {
  videoFile: FileActions;
  onClear: () => void;
}) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    key={"drag"}
    transition={{ type: "tween" }}
    className="rounded-2xl px-4 py-3 h-fit bg-gray-100 border border-gray-200"
  >
    <div className="text-sm">
      <div className="flex justify-between items-center border-b mb-2 pb-2">
        <p>File Input</p>
        <button
          onClick={onClear}
          type="button"
          className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950 flex-shrink-0"
        >
          Clear
        </button>
      </div>
      <p className="border-b mb-2 pb-2">{videoFile?.fileName}</p>
      <div className="flex justify-between items-center">
        <p>File size</p>
        <p>{bytesToSize(videoFile.fileSize)}</p>
      </div>
    </div>
  </motion.div>
);
