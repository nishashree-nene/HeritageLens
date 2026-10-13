
import { useEffect, useRef, useState } from "react";

type MonumentCameraProps = {
  onCapture: (image: File) => void;
};

export default function MonumentCamera({
  onCapture,
}: MonumentCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  async function startCamera() {
    setError("");
    setStarting(true);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is unavailable. Open the site using localhost or HTTPS."
        );
      }

      // Stop any previous camera stream.
      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        throw new Error("Camera preview element was not found.");
      }

      video.srcObject = stream;
      await video.play();
      setCameraOn(true);
    } catch (err) {
      setCameraOn(false);

      const cameraError = err as DOMException;
      if (cameraError.name === "NotAllowedError") {
        setError("Camera permission denied. Allow camera access in your browser settings.");
      } else if (cameraError.name === "NotFoundError") {
        setError("No camera was found on this device.");
      } else if (cameraError.name === "NotReadableError") {
        setError("Camera is busy. Close other apps using the camera and try again.");
      } else {
        setError(
          err instanceof Error ? err.message : "Could not start the camera."
        );
      }
    } finally {
      setStarting(false);
    }
  }

  function capturePhoto() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setError("Start the camera and wait until the live video appears.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setError("Could not capture the photo.");
      return;
    }

    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Could not create the photo.");
        return;
      }

      onCapture(new File([blob], "monument.jpg", {
        type: "image/jpeg",
      }));
    }, "image/jpeg", 0.9);
  }

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="block w-full h-64 sm:h-80 rounded-xl border border-yellow-600 bg-black object-contain"
      />

      {error && (
        <p role="alert" className="rounded-lg bg-red-950 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={startCamera}
          disabled={starting}
          className="rounded-lg bg-yellow-500 px-5 py-3 font-semibold text-black disabled:opacity-50"
        >
          {starting ? "Starting camera..." : cameraOn ? "Restart Camera" : "Start Camera"}
        </button>

        <button
          type="button"
          onClick={capturePhoto}
          disabled={!cameraOn}
          className="rounded-lg border border-yellow-600 px-5 py-3 text-yellow-400 disabled:opacity-40"
        >
          Capture Photo
        </button>
      </div>
    </div>
  );
}
