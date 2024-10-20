import Image from "next/image";
import Hero from "../components/hero";
import VideoDemo from "../components/video-demo";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto pt-32 space-y-16 sm:space-y-32">
      <div>
        <Hero />
        <VideoDemo />
      </div>
    </div>
  );
}
