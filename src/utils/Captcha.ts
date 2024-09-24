import { fabric } from "fabric";

import { CaptchaOptionsInterface } from "../types";
const shapes = ["none", "circle", "rectangle", "triangle"];
const CLICK_LIMIT = 15;
interface ShapeInterfaceBase extends fabric.Object {
  shape: string;
  id: string;
}

type ShapeType = fabric.ICircleOptions &
  fabric.ITriangleOptions &
  fabric.IRectOptions &
  ShapeInterfaceBase;

interface DrawParams {
  left: number;
  top: number;
  id?: number;
}

class Captcha {
  public canvas: fabric.Canvas;
  public options: CaptchaOptionsInterface;
  private _shapes: string[];
  private _elements: string[];
  private _clickCounter: number;
  private _misClick: number;
  constructor(el: HTMLDivElement, options: CaptchaOptionsInterface) {
    if (!el.querySelector("canvas")) {
      throw Error("Video or Canvas element not found in the container");
    }
    this.canvas = new fabric.Canvas(el.querySelector("canvas"), {
      width: options.canvasWidth || 500,
      height: options.canvasHeight || 500,
      hoverCursor: "default",
    });

    this.options = options;
    this._elements = [];
    this._clickCounter = 0;
    this._misClick = 0;
    this._shapes = Array.from(
      { length: options.rows * options.cols },
      () => shapes[Math.floor(Math.random() * shapes.length)]
    );

    this.init();
    this.defaultAll();
  }

  private defaultAll() {
    this._elements = this._shapes
      .map((shape, index) => ({ id: `a-${index}`, shape }))
      .filter((item) => item.shape === this.options.shape)
      .map((item) => item.id);

    this._clickCounter = 0;
    this._misClick = 0;
  }

  private init() {
    this.drawImage();
    this.addEventListener();
  }

  private drawImage() {
    fabric.Image.fromURL(this.options.imageData, (oImg) => {
      oImg.set({ selectable: false, top: 0, left: 0 });

      this.canvas.add(oImg);
      this.drawGrid();
    });
  }

  private drawGrid() {
    let counter = 0;
    for (let col = 0; col < this.options.cols; col++) {
      for (let row = 0; row < this.options.rows; row++) {
        const left = this.options.rectLeft + row * this.options.boxSize;
        const top = this.options.rectTop + col * this.options.boxSize;
        const rect = new fabric.Rect({
          left: left,
          top: top,
          width: this.options.boxSize,
          height: this.options.boxSize,
          strokeWidth: 1,
          stroke: "white",
          fill: "rgba(0,0,0,.5)",
          selectable: false,
        });

        this.canvas.add(rect);
        switch (this._shapes[counter]) {
          case "circle":
            this.drawCircle({ left, top, id: counter });
            break;
          case "triangle":
            this.drawTriangle({ left, top, id: counter });
            break;
          case "rectangle":
            this.drawRectangle({ left, top, id: counter });
            break;
        }
        counter++;
      }
    }
  }

  private drawCircle({ left, top, id }: DrawParams) {
    const { boxSize } = this.options;
    const circleRadius = boxSize / 4;
    const centerX = left + boxSize / 4;
    const centerY = top + boxSize / 4;

    const circle = new fabric.Circle({
      radius: circleRadius,
      fill: "rgba(255,255,255 , .8)",
      left: centerX,
      top: centerY,
      hoverCursor: "pointer",
      selectable: false,
      shape: "circle",
      id: `a-${id}`,
    } as ShapeType);

    this.canvas.add(circle);
  }

  private drawTriangle({ left, top, id }: DrawParams) {
    const { boxSize } = this.options;
    const triangleSize = boxSize * 0.5;
    const centerX = left + boxSize / 4;
    const centerY = top + boxSize / 4;

    const triangle = new fabric.Triangle({
      width: triangleSize,
      height: triangleSize,
      fill: "rgba(255,255,255 , .8)",
      left: centerX,
      top: centerY,
      hoverCursor: "pointer",
      selectable: false,
      shape: "triangle",
      id: `a-${id}`,
    } as ShapeType);
    this.canvas.add(triangle);
  }

  private drawRectangle({ left, top, id }: DrawParams) {
    const { boxSize } = this.options;
    const rectangleSize = boxSize * 0.5;
    const centerX = left + boxSize / 4;
    const centerY = top + boxSize / 4;

    const rectangle = new fabric.Rect({
      width: rectangleSize,
      height: rectangleSize,
      fill: "rgba(255,255,255 , .8)",
      left: centerX,
      top: centerY,
      hoverCursor: "pointer",
      selectable: false,
      shape: "rectangle",
      id: `a-${id}`,
    } as ShapeType);

    this.canvas.add(rectangle);
  }

  private selectItem(options: fabric.IEvent<Event>, color: string) {
    if (options.target && this._elements.length !== 0) {
      options.target.set("fill", color);
      this.canvas.renderAll();
    }
  }

  private mouseUpHandler = (options: fabric.IEvent<Event>) => {
    this._clickCounter++;
    const target = options.target as ShapeType;

    if (this._clickCounter > CLICK_LIMIT && this._elements.length !== 0) {
      this.options?.detectedBot?.();
      return;
    }

    if (target?.shape) {
      if (target?.shape === this.options.shape) {
        this.selectItem(options, "rgba(120, 245, 66, .5)");
        this._elements = this._elements.filter((item) => item !== target?.id);
        return;
      }
      this._misClick++;
      this.selectItem(options, "rgba(255, 0, 0, .5)");
      return;
    }
  };

  private addEventListener() {
    this.canvas.on("mouse:up", this.mouseUpHandler);
  }

  private removeEventListener() {
    this.canvas.off("mouse:up", this.mouseUpHandler);
  }

  public validate() {
    if (this._elements.length === 0 && this._misClick === 0) {
      return true;
    }
    return false;
  }

  public reDraw() {
    this.canvas.clear();
    this.defaultAll();
    this.removeEventListener();
    this.init();
  }
}

export default Captcha;
