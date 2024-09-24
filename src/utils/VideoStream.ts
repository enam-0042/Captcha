import { fabric } from "fabric";
import { CaptureInterface } from "../types";

class VideoStream {
  public canvas: fabric.Canvas;
  private _video: HTMLVideoElement;
  private _videoStream: fabric.Image | null;
  private _rect: fabric.Rect | null;

  constructor(el: HTMLDivElement) {
    if (!el.querySelector("canvas") || !el.querySelector("video")) {
      throw Error("Video or Canvas element not found in the container");
    }

    this._video = el.querySelector("video") as HTMLVideoElement;
    this.canvas = new fabric.Canvas(el.querySelector("canvas"), {
      width: this?._video?.width || 500,
      height: this?._video?.height || 500,
    });

    this._videoStream = null;
    this._rect = null;
    this.init();
  }

  private init() {
    this.startScreen();
    this.renderLoop();
  }

  private drawRect() {
    this._rect = new fabric.Rect({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      strokeWidth: 2,
      stroke: "white",
      fill: "transparent",
    });

    this.canvas.add(this._rect);
    this.animateRect();
  }

  private getRandomPosition() {
    if (!this._rect) return { left: 0, top: 0 };

    const maxX = this.canvas.width! - this._rect.width!;
    const maxY = this.canvas.height! - this._rect.height!;
    const left = Math.random() * maxX;
    const top = Math.random() * maxY;
    return { left, top };
  }

  private animateRect() {
    if (!this._rect) return;

    const { left, top } = this.getRandomPosition();

    this._rect.animate(
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

  private createVideo() {
    this._videoStream = new fabric.Image(this._video, {
      left: 0,
      top: 0,
      width: this._video.width,
      height: this._video.height,
      selectable: false,
    });

    this.canvas.add(this._videoStream);
    this._videoStream.moveTo(0);
  }

  private async startScreen() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this._video.srcObject = stream;
      this._video.onloadedmetadata = () => {
        this._video.play();
        this.createVideo();
        this.drawRect();
      };
    } catch (e) {
      console.error("Error accessing media devices.", e);
    }
  }

  private renderLoop() {
    const renderFrame = () => {
      if (this._videoStream) {
        this._videoStream.setElement(this._video);
        this._videoStream.setCoords();
      }

      this.canvas.renderAll();
      fabric.util.requestAnimFrame(renderFrame);
    };
    fabric.util.requestAnimFrame(renderFrame);
  }

  public captureImage(): CaptureInterface | undefined {
    if (!this._rect) return;
    const { left, top } = this._rect;
    this.canvas.remove(this._rect);
    const dataURL = this.canvas.toDataURL();

    return { imageData: dataURL, rectLeft: left || 0, rectTop: top || 0 };
  }
}

export default VideoStream;
