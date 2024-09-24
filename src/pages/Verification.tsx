import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageDataStore } from "../store";
import Captcha from "../utils/Captcha";
import { CaptchaOptionsInterface } from "../types";
import Modal from "../components/Modal";

const canvasOption: CaptchaOptionsInterface = {
  canvasWidth: 500,
  canvasHeight: 500,
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

  const [seemsBotModal, toggleBotModal] = useState(false);
  const [modalOpen, toggleModal] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isReverify, setIsReverify] = useState(false);

  const { data, resetData } = useImageDataStore();

  const handleBack = () => {
    resetData();
  };

  const detectedBot = () => {
    if (isValidated) return;
    toggleBotModal(true);
  };

  const reVerify = () => {
    captchaRef.current?.reDraw();
    setIsReverify(false);
  };

  const validate = () => {
    const isValid = captchaRef.current?.validate();
    if (isValid) {
      toggleModal(true);
      setIsValidated(true);
    } else {
      setIsReverify(true);
    }
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
      detectedBot: detectedBot,
    });

    return () => {
      captchaRef.current?.canvas.dispose();
    };
  }, [data]);

  return (
    <div ref={containerRef} className="p-12 bg-white ">
      <h2 className="text-3xl text-center text-[#0549A8] font-semibold mb-3 uppercase">
        Select {shape}
      </h2>

      <canvas />
      <div className="w-full flex justify-center">
        {isReverify ? (
          <button
            className="bg-[#DE9A0C] px-12  py-2  font-bold text-xl text-white mt-4 uppercase"
            onClick={reVerify}
          >
            Verify Again
          </button>
        ) : (
          <>
            <button
              className={`bg-[#DE9A0C] px-12 ${
                isValidated ? "opacity-30" : ""
              } py-2  font-bold text-xl text-white mt-4  uppercase`}
              onClick={validate}
              disabled={isValidated}
            >
              Validate
            </button>
          </>
        )}

        {isValidated && (
          <button
            className="bg-blue-400 px-12 ml-4 py-2  font-bold text-xl text-white mt-4 uppercase"
            onClick={handleBack}
          >
            Back
          </button>
        )}

        <Modal
          isOpen={modalOpen}
          onClose={() => {
            toggleModal(false);
          }}
        />

        <Modal
          isOpen={seemsBotModal}
          onClose={() => {
            toggleBotModal(false);
            reVerify();
          }}
          title="Seems You're Bot"
          btnText="Reverify"
        />
      </div>
    </div>
  );
}

export default Verification;
