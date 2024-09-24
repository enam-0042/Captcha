import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoStream from "../utils/VideoStream";
import { useImageDataStore } from "../store";
import Captcha from "../utils/Captcha";
import { CaptchaOptionsInterface } from "../types";

const canvasOption: CaptchaOptionsInterface = {
  canvasWidth: 400,
  canvasHeight: 400,
  rows: 5,
  cols: 5,
  boxSize: 40,
  imageData: "",
  rectLeft: 0,
  rectTop: 0,
  shape: "circle",
};
const shapes = ["circle", "rectangle", "triangle"];
const shape = shapes[Math.floor(Math.random() * shapes.length)];

function Verification() {
 
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const captchaRef = useRef<Captcha | null>(null);
  const [isReverify, setIsReverify] = useState(false);
  const { data, resetData } = useImageDataStore();
  const verify = () => {
    // set(true);
  };

  const detectedBot = () => {
    alert("Bot Detected");
  };
  const reVerify = () => {
    // resetData();
    captchaRef.current?.reDraw();
    setIsReverify(false);

  };
  const validate = () => {
    // console.log('is validating');
    const isValidated = captchaRef.current?.validate();
    if (isValidated) alert("Youre validated");
    else setIsReverify(true);
  };
  useEffect(() => {
    if (!containerRef.current || !data.imageData) {
      navigate("/");
      return;
    }
    captchaRef.current = new Captcha(containerRef.current, {
      ...canvasOption,
      ...data,
      shape: shape,
      verify: verify,
      detectedBot: detectedBot,
    });

    return () => {
      captchaRef.current?.canvas.dispose();
    };
  }, [data]);

  return (
    <div ref={containerRef} className="p-12 bg-white ">
      <h2 className="text-3xl text-center text-blue-400 font-semibold mb-3 uppercase">
        Select {shape}
      </h2>

      <canvas />
      <div className="w-full flex justify-center">
       {isReverify?(
        <button className="bg-orange-400 px-12  py-2  font-bold text-xl text-white mt-4 uppercase" 
        onClick={reVerify}>
          {" "}
          Verify Again
        </button>
       ):
       (
          <button
          className="bg-orange-400 px-12  py-2  font-bold text-xl text-white mt-4 uppercase"
          onClick={validate}
        >
          Validate
        </button>
       )
       }
      
        
      </div>
    </div>

    //     <div ref={containerRef}>
    //       {/* <video width={400} height={400} /> */}
    // <p>shape is {shape}</p>
    //       <canvas style={{ border: "1px solid" }} />
    //       {isVerified&&<p>You Are Verified</p> }
    //       <button onClick={reVerify}>Verify Again</button>
    //     </div>
  );
}

export default Verification;
