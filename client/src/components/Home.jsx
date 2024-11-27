import React from "react";
import { Link } from "react-router-dom";
import useVids from "../hooks/useVids";

function Home() {
  const videos = useVids();

  return (
    <>
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 min-h-screen py-12 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.key}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden p-6 transition-transform transform hover:scale-105"
            >
              <Link to={"/player/" + vid.key}>
                <div>
                  <img
                    src={`http://transcoded-videos-meg-app.s3-website-us-east-1.amazonaws.com/${vid.key}/thumbnail.jpg`}
                    alt={vid.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="mt-4">
                    <h2 className="font-semibold text-white">{vid.title}</h2>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
