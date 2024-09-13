import React, { useEffect, useRef } from "react";
import VideoStream from "../utils/VideoStream";

function Home() {
  const containerRef = useRef(null);
  const canvasRef = useRef<VideoStream | null>(null);
  const handleCapture = () => {};

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
