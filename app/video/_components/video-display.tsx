export const VideoDisplay = ({ videoUrl }: { videoUrl: string }) => (
  <video
    id="condense-video-player"
    controls
    className="h-full w-full rounded-3xl"
  >
    <source src={videoUrl} type="video/mp4" />
  </video>
);
