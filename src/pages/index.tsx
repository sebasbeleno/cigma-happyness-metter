import * as canvas from "canvas";
import * as faceapi from "face-api.js";
import * as tf from "@tensorflow/tfjs";
import * as tmImage from "@teachablemachine/image";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion, useAnimation, useAnimate } from "framer-motion";
import styles from "../styles/Home.module.css";

const getRandomTransformOrigin = () => {
  const value = (16 + 40 * Math.random()) / 100;
  const value2 = (15 + 36 * Math.random()) / 100;
  return {
    originX: value,
    originY: value2,
  };
};

const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);

const randomDuration = () => Math.random() * 0.07 + 0.23;

export const variants = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.3,
    },
  },
  hide: {
    y: -20,
    opacity: 0,
  },
};

const Index = () => {
  const [name, setName] = useState("");
  const [happyness, setHappyness] = useState(0);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    Webcam();
  }, []);

  async function Webcam() {
    // Loads models
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(startVideo);

    const video = document.getElementById("video");

    function startVideo() {
      navigator.getUserMedia(
        { video: {} },
        (stream) => (video.srcObject = stream),
        (err) => console.error(err)
      );
    }

    video.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        let fullFaceDescriptions = await faceapi
          .detectSingleFace(video)
          .withFaceLandmarks()
          .withFaceExpressions();

        /* const dims = faceapi.matchDimensions(canvas, video, true);
        const resizedResults = faceapi.resizeResults(
          fullFaceDescriptions,
          dims
        ); */

        if (fullFaceDescriptions) {
          const happy = fullFaceDescriptions.expressions.happy;

          const happyPercent = happy * 100;

          /*   faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
          faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions);
          faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions, 0.05); */

          setHappyness(parseInt(happyPercent));
        }
      }, 500);
    });
  }

  return (
    <div className="w-screen h-screen flex justify-center content-center items-center flex-col">
      <h1 className={`${styles.landing_title}`}>0 felicidad challenge</h1>
      <motion.div
        className="top-0 left-0 w-screen h-10 fixed bg-orange-600 "
        style={{ scaleX: happyness / 50 }}
        layout
        transition={{ duration: 0.3 }}
        initial={{ x: "100%" }}
        animate={{ x: "calc(100vw - 50%)" }}
        key={happyness / 100}
        variants={variants}
      />
      <div className="">
        <video
          id="video"
          height="640px"
          width="480px"
          autoPlay
          muted
          className="rounded-lg drop-shadow-2xl	"
        />
      </div>

      <div className="">
        <motion.h1
          variants={variants}
          className="text-4xl font-bold text-gray-900"
          key={happyness}
          animate={"show"}
          initial="hide"
        >
          {happyness}%
        </motion.h1>
      </div>
    </div>
  );
};
export default Index;
