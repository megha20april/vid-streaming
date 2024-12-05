import React, { useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import useVid from "../hooks/useVid";

export default function Player() {
  const { key } = useParams();

  const vidData = useVid(key);
  console.log("load");

  const [isBuffering, setIsBuffering] = useState(false);

  const handleBuffer = () => {
    setIsBuffering(true);
    console.log("Buffering...");
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
    console.log("Buffering ended.");
  };

  const handleError = (error) => {
    console.error("Playback error:", error);
  };

  console.log("key in player:", key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
      <div className="flex flex-col bg-[#111827] rounded-lg shadow-lg p-6 w-full max-w-4xl">
        {isBuffering && (
          <p className="text-center text-orange-500 font-bold mb-4">
            Buffering... Please wait.
          </p>
        )}
        <ReactPlayer
          key={key}
          url={`http://transcoded-videos-meg-app.s3-website-us-east-1.amazonaws.com/${key}/master.m3u8?`}
          playing
          controls
          width="100%"
          height="auto"
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onError={handleError}
        />
        {vidData && (
          <div className="px-8 my-4 w-full flex gap-4 justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">{vidData.title}</h1>
              <p className="text-gray-400 mt-2">{vidData.description}</p>
            </div>
            <div>
              <p className="text-gray-400 mt-2">Likes: {vidData.likes}</p>
              <p className="text-gray-400 mt-2">Comments: {vidData.comments}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
