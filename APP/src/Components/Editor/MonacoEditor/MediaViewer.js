import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";

const MediaViewer = () => {
  const imageExt = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"];
  const audioExt = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
  const videoExt = ["mp4", "webm", "mov", "avi", "mkv"];
  const docExt = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"];
  const { activeObject } = useSelector((state) => state.editor);
  console.log(activeObject);
  const types = ["image", "audio", "video", "docs"];
  return (
    <div className="h-full">
      {activeObject?.mediaType === types[0] && (
        <img alt="userFile" src={activeObject?.url} />
      )}
      {activeObject?.mediaType === types[1] && (
        <audio src={activeObject?.url} />
      )}
      {activeObject?.mediaType === types[2] && (
        <video src={activeObject?.url} />
      )}
      {activeObject?.mediaType === types[3] &&
        (activeObject?.url?.split(".").at(-1) === "pdf" ? (
          <iframe
            src={activeObject?.url}
            title="PDF Viewer"
            className="w-full h-full"
          />
        ) : (
          <div className="flex flex-col gap-y-3 items-center h-full justify-center">
            <p className="flex items-center text-3xl gap-x-2 text-red-700
            font-extrabold
            "><AiOutlineCloseCircle /> Preview Not Available </p>
            <a
              href={activeObject?.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-x-2 font-extrabold text-xl text-blue-600 duration-200
              transition-all hover:text-blue-400
              "
            >
              <FaDownload /> Download & Open Document
            </a>
          </div>
        ))}
    </div>
  );
};

export default MediaViewer;
