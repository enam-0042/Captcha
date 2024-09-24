interface CaptureInterface {
  imageData?: string;
  rectLeft?: number;
  rectTop?: number;
}


interface CaptchaOptionsInterface {
    canvasWidth?: number;
    canvasHeight?: number;
    rows: number;
    cols: number;
    rectLeft: number;
    rectTop: number;
    boxSize: number;
    imageData: string;
    // shape: 'circle'|'rectangle'|'triangle';
    shape: string,
    verify?: () => void;
    detectedBot?: ()=> void;
  }
  
export type { CaptureInterface, CaptchaOptionsInterface };
