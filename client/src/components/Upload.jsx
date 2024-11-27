import React, { useState } from "react";

// NOTE: Uploading.... State and when finished transcoding , it will be updated to "Uploaded"

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescp] = useState("");

  // Handles file selection and sets the state
  // without this i won't have access to the file
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent page reload

    if (!selectedFile) {
      setMessage("Please select a file."); // Show error
      setMessageColor("red");
      return;
    }

    // through this object, we're implicitly setting the content type to multipart/form-data
    const formData = new FormData(); // Create a FormData object
    formData.append("vids", selectedFile); // Append the file under the "vids" key
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData, // Send the FormData object in the body
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setMessageColor("green");
      } else {
        setMessage("File upload failed. Please try again.");
        setMessageColor("red");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageColor("red");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
      <div className="bg-[#111827] rounded-lg shadow-lg p-8 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Select Video File:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-gray-800 text-gray-400 border border-gray-600 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-600 bg-gray-800 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter the video title"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description:
            </label>

            <textarea
              name="description"
              id="description"
              onChange={(e) => setDescp(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              rows="4"
              placeholder="Enter the video description"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Upload
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center text-sm ${messageColor}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Upload;
