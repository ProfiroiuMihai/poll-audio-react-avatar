/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useRef, useState, useEffect, useCallback } from 'react';

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
      className="relative h-[90%] cursor-pointer"
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <audio
        autoPlay
        className="h-full w-full rounded-xl object-cover"
        controls
        controlsList="nodownload"
      >
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
    <div className="relative h-[90%]">
      <div className="absolute bottom-2 w-full px-4">
        <div>
          {capturing && (
            <p className="mx-auto w-28 rounded-full bg-warning px-3 py-1 text-center text-sm font-bold text-white">
              00:{timer < 10 ? `0${timer}` : timer} / 00:45
            </p>
          )}
          <div className="flex items-center justify-between gap-5">
            <div />

            <div className="">
              {capturing ? (
                <button
                  onClick={handleStopCaptureClick}
                  aria-label="stop"
                  className={capturing ? 'mr-8' : ''}
                >
                  <div className="h-16 w-16 rounded-full border-2 border-white">
                    <div className="mx-auto mt-4 h-7 w-7 rounded bg-warning" />
                  </div>
                </button>
              ) : (
                <button onClick={handleStartCaptureClick} aria-label="start">
                  <div className="h-16 w-16 rounded-full border-4 border-white">
                    <div className="mx-auto mt-[1.3px] h-[54px] w-[54px] rounded-full bg-warning" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
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
