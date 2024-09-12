import React, { useEffect, useRef, useState } from "react";
import VideoStream from "../utils/VideoStream";
import Validation from "./Validation";
function Captcha() {
  const [imageSource, setImageSource]= useState('');
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const handleCapture = () => {
    setImageSource(streamRef.current.captureImage());
  };

  useEffect(() => {
    streamRef.current = new VideoStream(canvasRef.current, cameraRef.current);
  }, []);
  return (
    <div>
      <video width={400} height={400} ref={cameraRef}>
        {" "}
      </video>
      <canvas ref={canvasRef} style={{ border: "1px solid" }}></canvas>
      <button onClick={handleCapture}>Capture</button>
      {/* <img     src={imageSource}   />    */}
      <Validation/>
    </div>
  );
}

export default Captcha;
