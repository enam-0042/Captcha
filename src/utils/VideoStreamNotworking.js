import { fabric } from "fabric";

class VideoStream {
  constructor(canvasEl, video) {
    this.canvas = new fabric.Canvas(canvasEl, {
      width: video.width || 640,
      height: video.height || 480,
    });
    this.video = video;
    this.streamImage = null;
    this.rect = null; // Store the rectangle for animation
    this.initCanvas();
  }

  // Initialize the canvas and video stream
  initCanvas() {
    this.startStream();
    this.renderLoop();
  }

  // Add rectangle to canvas and start the animation
  addRect() {
    this.rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      strokeWidth: 5,
      stroke: "rgba(100, 200, 200, 0.5)",
      fill: "transparent",
    });
    this.canvas.add(this.rect);
    this.animateRect(); // Start animation after rectangle is added
  }

  // Create a fabric image for the video
  createVideoImage() {
    this.streamImage = new fabric.Image(this.video, {
      left: 0,
      top: 0,
      selectable: false, // Makes the video stream non-selectable
    });
    this.canvas.add(this.streamImage);
    this.streamImage.moveTo(0); // Move the stream to the back layer
  }

  // Function to get a random position on the canvas for the rectangle
  getRandomPosition() {
    const maxX = this.canvas.width - this.rect.width;
    const maxY = this.canvas.height - this.rect.height;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    return { x, y };
  }

  // Function to animate the rectangle to a random position
  animateRect() {
    const { x, y } = this.getRandomPosition();
    this.rect.animate(
      {
        left: x,
        top: y,
      },
      {
        duration: 200, // Adjust duration as needed
        onChange: this.canvas.renderAll.bind(this.canvas), // Re-render canvas on change
        onComplete: () => {
          this.animateRect(); // Restart animation after completion
        },
      }
    );
  }

  captureImage() {
    const { left, top } = this.rect;
    this.canvas.remove(this.rect);
    const dataURL = this.canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });

    return {
      dataURL,
      rectPosX: left,
      rectPosY: top,
      canvasHeight: this.canvas.height,
      canvasWidth: this.canvas.width,
    };
  }

  async startStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.video.srcObject = stream;

      // Load the video into the fabric.Image only after metadata is loaded
      this.video.onloadedmetadata = () => {
        this.video.play();
        this.createVideoImage();
        this.addRect(); // Add the rectangle after video starts
      };
    } catch (err) {
      console.error("Error accessing the camera:", err);
      // Optionally provide UI feedback here
    }
  }

  // Main rendering loop using requestAnimationFrame
  renderLoop() {
    const renderFrame = () => {
      if (this.streamImage) {
        // Update the image element on each frame to reflect the video stream
        this.streamImage.setElement(this.video);
        this.streamImage.setCoords(); // Ensure the new position and size are correct
      }
      this.canvas.renderAll();
      fabric.util.requestAnimFrame(renderFrame);
    };
    fabric.util.requestAnimFrame(renderFrame);
  }
}

export default VideoStream;