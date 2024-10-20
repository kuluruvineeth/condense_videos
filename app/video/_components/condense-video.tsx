"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CustomDropZone } from "./custom-dropzone";
import { acceptedVideoFiles } from "@/utils/formats";
import { useEffect, useRef, useState } from "react";
import {
  FileActions,
  QualityType,
  VideoFormats,
  VideoInputSettings,
} from "@/utils/types";
import { VideoDisplay } from "./video-display";
import { VideoInputDetails } from "./video-input-details";
import { VideoTrim } from "./video-trim";
import { VideoInputControl } from "./video-input-control";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { toast } from "sonner";
import convertFile from "@/utils/convert";
import { VideoCondenseProgress } from "./video-condense-progress";
import { VideoOutputDetails } from "./video-output-details";

const CondenseVideo = () => {
  const [videoFile, setVideoFile] = useState<FileActions>();
  const [progress, setProgess] = useState<number>(0);
  const [time, setTime] = useState<{
    startTime?: Date;
    elapsedSeconds?: number;
  }>({ elapsedSeconds: 0 });
  const [status, setStatus] = useState<
    "notStarted" | "converted" | "condensing"
  >("notStarted");
  const [videoSettings, setVideoSettings] = useState<VideoInputSettings>({
    quality: QualityType.High,
    videoType: VideoFormats.MP4,
    customEndTime: 0,
    customStartTime: 0,
    removeAudio: false,
    twitterCompressionCommand: false,
    whatsappStatusCompressionCommand: false,
  });
  const handleUpload = (file: File) => {
    setVideoFile({
      fileName: file.name,
      fileSize: file.size,
      from: file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2),
      fileType: file.type,
      file,
      isError: false,
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (time?.startTime) {
      timer = setInterval(() => {
        const endTime = new Date();
        const timeDifference = endTime.getTime() - time.startTime!.getTime();
        setTime({ ...time, elapsedSeconds: timeDifference });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [time]);

  const ffmpegRef = useRef(new FFmpeg());

  const disableDuringCompression = status === "condensing";

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(
        `http://localhost:3000/download/ffmpeg-core.js`,
        "text/javascript"
      ),
      wasmURL: await toBlobURL(
        `http://localhost:3000/download/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
  };

  const loadWithToast = () => {
    toast.promise(load, {
      loading: "Downloading necessary packages from FFmpeg for offline use.",
      success: () => {
        return "All necessary file downloaded";
      },
      error: "Error loading FFmpeg packages",
    });
  };

  useEffect(() => loadWithToast(), []);

  const condense = async () => {
    if (!videoFile) return;
    try {
      setTime({ ...time, startTime: new Date() });
      setStatus("condensing");
      ffmpegRef.current.on("progress", ({ progress: completion, time }) => {
        const percentage = completion * 100;
        setProgess(percentage);
      });
      ffmpegRef.current.on("log", ({ message }) => {
        console.log(message);
      });
      const { url, output, outputBlob } = await convertFile(
        ffmpegRef.current,
        videoFile,
        videoSettings
      );
      setVideoFile({
        ...videoFile,
        url,
        output,
        outputBlob,
      });
      setTime((oldTime) => ({ ...oldTime, startTime: undefined }));
      setStatus("converted");
      setProgess(0);
    } catch (err) {
      console.log(err);
      setStatus("notStarted");
      setProgess(0);
      setTime({ elapsedSeconds: 0, startTime: undefined });
      toast.error("Error condensing video");
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        key={"drag"}
        transition={{ type: "tween" }}
        className="border rounded-3xl col-span-5 flex w-full md:h-full bg-gray-50/35"
      >
        {videoFile ? (
          <VideoDisplay videoUrl={URL.createObjectURL(videoFile.file)} />
        ) : (
          <CustomDropZone
            handleUpload={handleUpload}
            acceptedFiles={acceptedVideoFiles}
          />
        )}
      </motion.div>
      <AnimatePresence mode="popLayout">
        <motion.div className="border rounded-3xl col-span-3 flex w-full md:h-full bg-gray-50/35 p-4 relative">
          <div className="flex flex-col gap-4 w-full">
            {videoFile && (
              <>
                <VideoInputDetails
                  videoFile={videoFile}
                  onClear={() => window.location.reload()}
                />
                <VideoTrim
                  disable={disableDuringCompression}
                  onVideoSettingsChange={setVideoSettings}
                  videoSettings={videoSettings}
                />
              </>
            )}
            <VideoInputControl
              disable={disableDuringCompression}
              onVideoSettingsChange={setVideoSettings}
              videoSettings={videoSettings}
            />

            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              key={"button"}
              transition={{ type: "tween" }}
              className="bg-gray-100 border-gray-200 rounded-2xl p-3 h-fit"
            >
              {status === "condensing" && (
                <VideoCondenseProgress
                  progress={progress}
                  seconds={time.elapsedSeconds!}
                />
              )}

              {(status === "notStarted" || status === "converted") && (
                <button
                  onClick={condense}
                  type="button"
                  className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-950 to-zinc-950 rounded-lg text-white/90 relative px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-500 focus:ring-zinc-950 flex-shrink-0"
                >
                  Condense
                </button>
              )}
            </motion.div>
            {status === "converted" && videoFile && (
              <VideoOutputDetails
                timeTaken={time.elapsedSeconds}
                videoFile={videoFile!}
              />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default CondenseVideo;
