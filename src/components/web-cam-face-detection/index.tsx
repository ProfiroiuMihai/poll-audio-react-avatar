/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import RecordRTC from 'recordrtc';

interface IProps {
  capturing: boolean;
  setCapturing: React.Dispatch<React.SetStateAction<boolean>>;
  isFinishedRecording: boolean;
  setIsFinishedRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setRecordedChunks: React.Dispatch<React.SetStateAction<Blob[]>> | any;
  recordedChunks: Blob[];
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

// Define the functional component
const WebcamDemo: React.FC<IProps> = ({
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
  const recorderRef: MutableRefObject<RecordRTC | null> =
    useRef<RecordRTC | null>(null);

  const handleStartCaptureClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setCapturing(true);

      const options: RecordRTC.Options = {
        type: 'audio',
        mimeType: 'audio/wav',
      };

      recorderRef.current = new RecordRTC(stream, options);
      recorderRef.current.startRecording();
      setTimer(0);
      setTimeout(() => {}, 2000);
    } catch (error) {
      console.error('Error accessing microphone', error);
      setCapturing(false);
    }
  };

  const handleStopCaptureClick = () => {
    if (recorderRef.current) {
      try {
        recorderRef.current.stopRecording(() => {
          // @ts-ignore
          const recordedBlob: Blob = recorderRef.current.getBlob();
          if (recordedBlob.size > 0) {
            setRecordedChunks([...recordedChunks, recordedBlob]);
          }
          // @ts-ignore
          recorderRef.current.reset();
          recorderRef.current = null;
          setCapturing(false);
          setIsFinishedRecording(true);
          setStep(step + 1);
        });
      } catch (error) {
        console.error('Error stopping recording', error);
        setCapturing(false);
      }
    }
  };

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
  }, [capturing]);

  return isFinishedRecording ? (
    <div className="relative h-[90%] cursor-pointer">
      {recordedChunks.length > 0 ? (
        <audio
          autoPlay
          className="h-full w-full rounded-xl object-cover"
          controls
          controlsList="nodownload"
        >
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="audio/webm"
          />
          <source
            src={URL.createObjectURL(recordedChunks[recordedChunks.length - 1])}
            type="audio/mp4"
          />
        </audio>
      ) : (
        <p className="text-center font-semibold">
          Please open in a supported browser for recording preview features.
        </p>
      )}
    </div>
  ) : (
    <div className="relative h-[90%]">
      <div className="bg-gray-200 flex h-full w-full items-center justify-center">
        <p className="text-lg">Audio Recorder</p>
      </div>
      <div className="absolute bottom-2 w-full px-4">
        <div>
          {capturing && (
            <p className="mx-auto w-28 rounded-full bg-warning px-3 py-1 text-center text-sm font-bold text-white">
              00:{timer < 10 ? `0${timer}` : timer} / 00:45
            </p>
          )}
          <div className="flex items-center justify-between gap-5">
            <div className="" />

            <div className="ml-8 mt-2">
              {capturing ? (
                <button
                  onClick={handleStopCaptureClick}
                  aria-label="stop"
                  className={capturing ? 'mr-[45px]' : ''}
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

            <div className="" />
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

export default WebcamDemo;
