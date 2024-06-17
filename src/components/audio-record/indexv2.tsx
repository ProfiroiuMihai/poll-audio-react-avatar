/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaMicrophone } from 'react-icons/fa';

interface IProps {
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordedChunks: any;
  recordedChunks: Blob[];
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const WebcamDemoForIosDevices: React.FC<IProps> = ({
  capturing,
  setCapturing,
  isFinishedRecording,
  setIsFinishedRecording,
  recordedChunks,
  setRecordedChunks,
  setStep,
  step,
}) => {
  const [timer, setTimer] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [soundLevel, setSoundLevel] = useState(0);

  const handleDataAvailable = ({ data }: any) => {
    if (data.size > 0) {
      setRecordedChunks((prev: any) => prev.concat(data as Blob));
    }
  };

  const handleStartCaptureClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setCapturing(true);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener(
        'dataavailable',
        handleDataAvailable
      );
      mediaRecorderRef.current.start();
      setTimer(0);

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const analyzeSound = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        setSoundLevel(average);
        requestAnimationFrame(analyzeSound);
      };

      analyzeSound();
    } catch (error) {
      setCapturing(false);
    }
  };

  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsFinishedRecording(true);
      setCapturing(false);
      setStep(step + 1);
    }
  }, [setIsFinishedRecording, setCapturing, setStep, step]);

  useEffect(() => {
    let intervalId: any;
    if (capturing) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer < 44) {
            return prevTimer + 1;
          }
          handleStopCaptureClick();
          return 45;
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
      setTimer(0);
    }
    return () => clearInterval(intervalId);
  }, [capturing, handleStopCaptureClick]);

  return isFinishedRecording ? (
    <div
      className="flex h-[90%] flex-col items-center justify-center"
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <audio className="" controls controlsList="nodownload">
        <source
          src={URL.createObjectURL(
            new Blob(recordedChunks, { type: 'audio/webm' })
          )}
        />
        <source
          src={URL.createObjectURL(
            new Blob(recordedChunks, { type: 'audio/mp3' })
          )}
        />
      </audio>
    </div>
  ) : (
    <div className="flex h-[90%] flex-col items-center justify-center">
      {capturing ? (
        <button
          onClick={handleStopCaptureClick}
          aria-label="stop"
          className="relative flex h-20 w-20 items-center justify-center rounded-full"
        >
          <FaMicrophone size={30} color="#334256" className="mx-auto" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: `0 0 ${soundLevel / 2}px ${soundLevel / 2}px #808080bf`,
            }}
          />
        </button>
      ) : (
        <button
          onClick={handleStartCaptureClick}
          aria-label="start"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#334256]"
        >
          <FaMicrophone size={30} color="#fff" className="mx-auto" />
        </button>
      )}

      {capturing ? (
        <p className="mt-10 font-semibold text-secondary">
          00:{timer < 10 ? `0${timer}` : timer} : 00:45
        </p>
      ) : (
        <p className="mt-10 opacity-0">dfddfas</p>
      )}

      {capturing ? (
        <p className="mt-10 text-center text-secondary">
          Apasă STOP pentru a încheia
        </p>
      ) : (
        <p className="mt-10 text-center text-secondary">
          Apasă REC pentru înregistrare
        </p>
      )}
    </div>
  );
};

export default WebcamDemoForIosDevices;
