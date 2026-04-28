import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
  HeartPulse,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type HealthScreenResponse = {
  result?: string;
  error?: string;
};

export function HealthScreening() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isScreening, setIsScreening] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const resetForm = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    setSelectedImage(null);
    setSelectedFileName(null);
    setResult(null);
    setError(null);
    setIsScreening(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleHealthScreening = async (file: File) => {
    setError(null);
    setResult(null);
    setIsScreening(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/pet-analysis?action=screen-health", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as HealthScreenResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to screen the pet health image.");
      }

      if (!data.result) {
        throw new Error("The server returned an empty screening result.");
      }

      setResult(data.result);
    } catch (screeningError) {
      setError(
        screeningError instanceof Error
          ? screeningError.message
          : "We couldn't screen this image right now. Please try again.",
      );
    } finally {
      setIsScreening(false);
    }
  };

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file such as JPG, PNG, or HEIC.");
      return;
    }

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setSelectedFileName(file.name);

    await handleHealthScreening(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    await handleFile(e.dataTransfer.files?.[0]);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFile(e.target.files?.[0]);
  };

  const isHealthy = result === "Healthy";

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Pet Health Screening
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Upload a fish photo to screen for visible disease signs using the
            Shell &amp; Fin health screening model.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          <AnimatePresence mode="wait">
            {!selectedImage && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-12 text-center border-4 border-dashed m-6 rounded-2xl transition-colors ${
                  dragActive
                    ? "border-pink-500 bg-pink-50"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mx-auto w-24 h-24 mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                  <HeartPulse className="w-12 h-12 text-pink-600" />
                </div>

                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  Upload a pet health photo
                </h3>

                <p className="text-stone-500 mb-8">
                  Choose a clear fish photo for health screening.
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" /> Select Photo
                </button>

                <p className="text-xs text-stone-400 mt-4 uppercase tracking-widest font-semibold">
                  Supported: JPG, PNG, HEIC
                </p>

                {error && (
                  <p className="mt-4 text-sm text-rose-600 font-medium">
                    {error}
                  </p>
                )}
              </motion.div>
            )}

            {selectedImage && isScreening && (
              <motion.div
                key="screening"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={selectedImage}
                    alt="Screening"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-pink-500/20 scan-line"></div>
                </div>

                <Loader2 className="w-10 h-10 text-pink-600 animate-spin mb-4" />

                <h3 className="text-2xl font-bold text-stone-800">
                  Screening Photo...
                </h3>

                <p className="text-stone-500">
                  Sending your image to the health screening model.
                </p>
              </motion.div>
            )}

            {selectedImage && !isScreening && (result || error) && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-1/3">
                    <img
                      src={selectedImage}
                      alt={selectedFileName || "Uploaded"}
                      className="w-full aspect-square object-cover rounded-2xl shadow-md border-4 border-white mb-4"
                    />

                    {selectedFileName && (
                      <p className="text-sm text-stone-500 mb-4 truncate">
                        {selectedFileName}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={resetForm}
                      className="w-full py-3 text-stone-500 hover:text-stone-800 font-medium flex items-center justify-center gap-2 transition-colors border border-stone-200 rounded-xl hover:bg-stone-50"
                    >
                      <ImageIcon className="w-4 h-4" /> Try another photo
                    </button>
                  </div>

                  <div className="w-full md:w-2/3 space-y-6">
                    {error && (
                      <div className="p-4 rounded-xl border-l-4 bg-rose-50 border-rose-500 text-rose-800">
                        <div className="flex gap-3">
                          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold mb-1">
                              Health screening unavailable
                            </h4>
                            <p className="text-sm opacity-90">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {result && (
                      <>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="text-pink-500 w-6 h-6" />
                            <span className="text-pink-700 font-bold uppercase tracking-wider text-sm">
                              Health Screening Result
                            </span>
                          </div>

                          <h2 className="text-3xl font-extrabold text-stone-900">
                            {result}
                          </h2>
                        </div>

                        <div
                          className={`p-4 rounded-xl border-l-4 ${
                            isHealthy
                              ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                              : "bg-amber-50 border-amber-500 text-amber-800"
                          }`}
                        >
                          <div className="flex gap-3">
                            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold mb-1">
                                {isHealthy
                                  ? "No disease class detected"
                                  : "Possible disease class detected"}
                              </h4>
                              <p className="text-sm opacity-90">
                                This is an AI screening result only. Use it as
                                an early warning, not as a final diagnosis.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .scan-line {
          animation: scan 2s linear infinite;
          background: linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.5), transparent);
        }
      `}</style>
    </div>
  );
}
