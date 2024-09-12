import { fabric } from "fabric";

class VideoStream {
  constructor(canvasEl, videoEl) {
    this.canvas = new fabric.Canvas(canvasEl, {
      width: videoEl.width || 500,
      height: videoEl.height || 500,
    });
    this.video = videoEl;
    this.videoStream = null;
    this.rect = null;
    this.init();
  }
  init() {
    this.startScreen();
    this.renderLoop();
  }

  drawRect() {
    this.rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      strokeWidth: 2,
      stroke: "white",
      fill: "transparent",
    });
    this.canvas.add(this.rect);
    this.animateRect();
  }

  getRandomPosition() {
    const maxX = this.canvas.width - this.rect.width;
    const maxY = this.canvas.height - this.rect.height;
    const left = Math.random() * maxX;
    const top = Math.random() * maxY;
    return { left, top };
  }

  animateRect() {
    const { left, top } = this.getRandomPosition();
    this.rect.animate(
      {
        left,
        top,
      },
      {
        duration: 2000,
        onChange: this.canvas.renderAll.bind(this.canvas),
        onComplete: () => {
          this.animateRect();
        },
      }
    );
  }

  captureImage() {
    this.canvas.remove(this.rect);
    const dataURL = this.canvas.toDataURL("png");
    console.log(dataURL);

    return dataURL;
    // console.log('hello');
  }
  createVideo() {
    this.videoStream = new fabric.Image(this.video, {
      left: 0,
      top: 0,
      width: this.video.width,
      height: this.video.height,
      selectable: false,
      //   objectCaching: false,
    });
    this.canvas.add(this.videoStream);
    this.videoStream.moveTo(0);
  }

  async startScreen() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = stream;
      this.video.onloadedmetadata = () => {
        this.video.play();
        this.createVideo();
        this.drawRect();
      };
    } catch (e) {}
  }

  renderLoop() {
    const renderFrame = () => {
      if (this.videoStream) {
        // console.log("first");
        // Update the image element on each frame to reflect the video stream
        this.videoStream.setElement(this.video);
        this.videoStream.setCoords(); // Ensure the new position and size are correct
      }
      this.canvas.renderAll();
      fabric.util.requestAnimFrame(renderFrame);
    };
    fabric.util.requestAnimFrame(renderFrame);
  }
}

export default VideoStream;
