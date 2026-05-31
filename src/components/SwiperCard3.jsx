"use client";

import { useState } from 'react';
import { Button } from "./ui/Button";
import geneVideo from "../assets/videos/GenieClubluxe.mp4";
import Link from "next/link";

export const SwiperCard3 = () => {
  const [muted, setMuted] = useState(true); // State to manage mute/unmute

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className="max-h-screen w-full rounded-3xl md:h-screen overflow-y-hidden   ">
      <div className="w-screen h-screen relative">
        {/* Desktop Video */}
        <video
          src={geneVideo}
          autoPlay
          loop
          muted={muted} // Muted state
          playsInline
          className="hidden md:block w-full h-full object-cover"
          onClick={toggleMute} // Toggle mute/unmute on click
        />
        
        {/* Mobile Video */}
        <video
          src={geneVideo}
          autoPlay
          loop
          muted={muted} // Muted state
          playsInline
          className="block md:hidden w-full h-full object-cover"
          style={{ marginTop: '-50%', marginBottom: '-30%' }} // Adjust margins to center vertically
          onClick={toggleMute} // Toggle mute/unmute on click
        />

        {/* Your content or UI elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center">
          {/* Content here */}
        </div>
      </div>
    </div>
  );
};
