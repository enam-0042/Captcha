import React, { useEffect, useRef } from "react";
import VideoStream from "../utils/VideoStream";
import { useImageDataStore } from "../store";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const canvasRef = useRef<VideoStream | null>(null);
  const { setData } = useImageDataStore();

  const handleCapture = () => {
    const data = canvasRef.current?.captureImage();
    if (data) {
      setData(data);
      navigate('/verification');
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    canvasRef.current = new VideoStream(containerRef.current);
  }, []);

  return (
    <div ref={containerRef}>
      <video width={400} height={400} />

      <canvas style={{ border: "1px solid" }} />
      <button onClick={handleCapture}>Capture</button>
    </div>
  );
}

export default Home;
