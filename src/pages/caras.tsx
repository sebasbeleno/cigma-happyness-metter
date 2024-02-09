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
  const [sadness, setSadness] = useState(0);
  const [angry, setAngry] = useState(0);
  const [neutra, setNeutra] = useState(0);
  const [fear, setFear] = useState(0);

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
          const sad = fullFaceDescriptions.expressions.sad;
          const angry = fullFaceDescriptions.expressions.angry;
          const neutral = fullFaceDescriptions.expressions.neutral;
          const fear = fullFaceDescriptions.expressions.fear;

          const sadPercent = sad * 100;
          const angryPercent = angry * 100;
          const neutralPercent = neutral * 100;
          const fearPercent = fear * 100;

          const happyPercent = happy * 100;

          /*   faceapi.draw.drawDetections(canvas, fullFaceDescriptions);
          faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions);
          faceapi.draw.drawFaceExpressions(canvas, fullFaceDescriptions, 0.05); */

          setHappyness(parseInt(happyPercent));
          setSadness(parseInt(sadPercent));
          setAngry(parseInt(angryPercent));
          setNeutra(parseInt(neutralPercent));
          setFear(parseInt(fearPercent));

          console.log(fullFaceDescriptions.expressions);
        }
      }, 500);
    });
  }

  return (
    <div className="w-screen h-screen flex justify-center content-center items-center flex-row">
      <div className="flex flex-col justify-center items-center content-center">
        <h1 className={`${styles.landing_title}`}>Emocionometros</h1>

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
      </div>

      <div className="ml-5">
        <motion.h1
          variants={variants}
          className="text-4xl font-bold text-gray-900"
          key={happyness}
          animate={"show"}
          initial="hide"
        >
          Felicidad {happyness}%
        </motion.h1>
        <motion.h1
          variants={variants}
          className="text-4xl font-bold text-gray-900"
          key={angry}
          animate={"show"}
          initial="hide"
        >
          Enojo {angry}%
        </motion.h1>
        <motion.h1
          variants={variants}
          className="text-4xl font-bold text-gray-900"
          key={sadness}
          animate={"show"}
          initial="hide"
        >
          Tristeza {sadness}%
        </motion.h1>
        <motion.h1
          variants={variants}
          className="text-4xl font-bold text-gray-900"
          key={neutra}
          animate={"show"}
          initial="hide"
        >
          Neutral {neutra}%
        </motion.h1>
        <motion.h1
          variants={variants}
          className="text-4xl font-bold text-gray-900"
          key={fear}
          animate={"show"}
          initial="hide"
        >
          Miedo {fear}%
        </motion.h1>
      </div>
    </div>
  );
};
export default Index;
