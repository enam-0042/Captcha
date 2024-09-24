import { fabric } from "fabric";

const shapes = ["none", "circle", "rectangle", "triangle"];

class Captcha {
  constructor(el, options) {
    this.canvas = new fabric.Canvas(el, {
      width: options.canvasWidth || 500,
      height: options.canvasHeight || 500,
      hoverCursor: "default",
    });
    // this.rect=null;
    this.options = options;

    this.shapes = Array.from(
      { length: options.rows * options.cols },
      () => shapes[Math.floor(Math.random() * shapes.length) ]
    );
    
    this.elements = this.shapes.map( (item,index)=> ({id:`a-${index}`, shape:item})).filter(item=> item.shape===this.options.shape)
    .map((item)=> item.id);
    console.log(this.elements);
    // console.log(this.shapes);
    this.init();
  }
  init() {
    this.drawImage();
    // this.renderLoop();
    this.addEventListener();
  }
  drawImage() {
    fabric.Image.fromURL(this.options.imageData, (oImg) => {
      oImg.set({ selectable: false, top: 0, left: 0 });
      this.canvas.add(oImg);
      this.drawGrid();
    });
  }

  drawGrid() {
    let counter = 0;
    console.log(this.shapes);
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
        switch (this.shapes[counter]) {
          case "circle":
            this.drawCircle({ left, top , id:counter});
            break;
          case "triangle":
            this.drawTriangle({ left, top });
            break;
          case "rectangle":
            this.drawRectangle({ left, top });
            break;
        
        }
        counter++;
        // if(this.shapes[counter--]==='circle'        ){
        //     this.drawCircle({left,top});
        // }
        // else if(this.shapes[counter--]==='triangle'        ){
        //     this.drawTriangle({left,top});
        // }

        // this.drawCircle({left, top});
        // this.drawRectangle({ left, top });
      }
    }
  }

  drawCircle({ left, top, id }) {
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
      shape: 'circle',
      id: `a-${id}`
    });
    this.canvas.add(circle);
  }

  drawTriangle({ left, top }) {
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
    });
    this.canvas.add(triangle);
  }

  drawRectangle({ left, top }) {
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
    });
    this.canvas.add(rectangle);
  }

  selectItem(options){
    options.target.set('fill', 'rgba(120, 245, 66, .5)');
    this.canvas.renderAll();
    console.log('here')
  }

  addEventListener(){
    this.canvas.on('mouse:up', (options) => {
        if (options?.target?.shape===this.options.shape) {
          // options.id.set('fill')
          this.selectItem(options);
          console.log('an object was clicked! ', options.target.shape);
          this.elements=this.elements.filter((item)=>item!==options.target.id)
          if(this.elements.length===0){
            this.options.verify();
          }

          console.log(options.target);
        }
      });
  }

  renderLoop() {
    const renderFrame = () => {
      this.canvas.renderAll();
      fabric.util.requestAnimFrame(renderFrame);
    };
    fabric.util.requestAnimFrame(renderFrame);
  }
}

export default Captcha;
