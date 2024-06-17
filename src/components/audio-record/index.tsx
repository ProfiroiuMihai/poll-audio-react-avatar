/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import RecordRTC from 'recordrtc';
import { FaMicrophone } from 'react-icons/fa';

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
  const [, setTimer] = useState(0);
  const [soundLevel, setSoundLevel] = useState(0);
  const recorderRef: MutableRefObject<RecordRTC | null> =
    useRef<RecordRTC | null>(null);
  const audioContextRef: MutableRefObject<AudioContext | null> =
    useRef<AudioContext | null>(null);
  const analyserRef: MutableRefObject<AnalyserNode | null> =
    useRef<AnalyserNode | null>(null);
  const dataArrayRef: MutableRefObject<Uint8Array | null> =
    useRef<Uint8Array | null>(null);
  const mediaStreamRef: MutableRefObject<MediaStream | null> =
    useRef<MediaStream | null>(null);

  const handleStartCaptureClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setCapturing(true);
      mediaStreamRef.current = stream;

      const options: RecordRTC.Options = {
        type: 'audio',
        mimeType: 'audio/ogg',
      };

      recorderRef.current = new RecordRTC(stream, options);
      recorderRef.current.startRecording();
      setTimer(0);

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const analyzeSound = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
          const average = sum / dataArrayRef.current.length;
          setSoundLevel(average);
          requestAnimationFrame(analyzeSound);
        }
      };

      analyzeSound();
    } catch (error) {
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
        setCapturing(false);
      }
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (capturing) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer < 179) {
            return prevTimer + 1;
          }
          handleStopCaptureClick();
          return 179;
        });
      }, 1000);
    } else {
      clearInterval(intervalId);
      setTimer(0);
    }
    return () => clearInterval(intervalId);
  }, [capturing]);

  return isFinishedRecording ? (
    <div className="flex h-[90%] flex-col items-center justify-center">
      {recordedChunks.length > 0 ? (
        <audio
          autoPlay={false}
          controls
          controlsList="nodownload"
          onPlay={(e) => {
            const audio = e.target as HTMLAudioElement;
            audio.currentTime = 0;
          }}
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
    <div className="mt-[45%] flex h-[90%] flex-col items-center justify-center">
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
