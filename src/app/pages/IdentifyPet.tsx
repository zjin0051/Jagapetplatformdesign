import React, { useState } from "react";
import {
  Camera,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { speciesData } from "../data/species";

export function IdentifyPet() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<(typeof speciesData)[0] | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = () => {
    // For prototype: Just mock an image and start scanning
    const mockImage =
      "https://images.unsplash.com/photo-1774266870873-38dd0d11b547?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBlYXJlZCUyMHNsaWRlciUyMHR1cnRsZSUyMGluJTIwd2F0ZXJ8ZW58MXx8fHwxNzc0NzE4NTcxfDA&ixlib=rb-4.1.0&q=80&w=1080";
    setSelectedImage(mockImage);
    setIsScanning(true);

    // Simulate API delay
    setTimeout(() => {
      setIsScanning(false);
      // Hardcode to Red-Eared Slider for the prototype
      setResult(speciesData.find((s) => s.id === "red-eared-slider") || null);
    }, 2500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload();
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight">
            Identify a Species
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Upload a photo of a fish or turtle. We'll help you identify it, warn
            you of any biodiversity risks, and provide basic visible health
            screening tips.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden">
          {/* Upload Area */}
          <AnimatePresence mode="wait">
            {!selectedImage && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-12 text-center border-4 border-dashed m-6 rounded-2xl transition-colors ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-stone-200 hover:bg-stone-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mx-auto w-24 h-24 mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <UploadCloud className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-800 mb-2">
                  Drag & Drop your photo here
                </h3>
                <p className="text-stone-500 mb-8">
                  or click the button below to browse
                </p>

                <button
                  onClick={simulateUpload}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" /> Select Photo
                </button>
                <p className="text-xs text-stone-400 mt-4 uppercase tracking-widest font-semibold">
                  Supported: JPG, PNG, HEIC
                </p>
              </motion.div>
            )}

            {/* Scanning State */}
            {selectedImage && isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 flex flex-col items-center justify-center min-h-[400px]"
              >
                <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={selectedImage}
                    alt="Scanning"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-500/20 scan-line"></div>
                </div>
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                <h3 className="text-2xl font-bold text-stone-800">
                  Analyzing Photo...
                </h3>
                <p className="text-stone-500">
                  Checking Shell & Fin MY database for a match.
                </p>
              </motion.div>
            )}

            {/* Result State */}
            {selectedImage && !isScanning && result && (
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
                      alt="Uploaded"
                      className="w-full aspect-square object-cover rounded-2xl shadow-md border-4 border-white mb-4"
                    />
                    <button
                      onClick={resetForm}
                      className="w-full py-3 text-stone-500 hover:text-stone-800 font-medium flex items-center justify-center gap-2 transition-colors border border-stone-200 rounded-xl hover:bg-stone-50"
                    >
                      <ImageIcon className="w-4 h-4" /> Try another photo
                    </button>
                  </div>

                  <div className="w-full md:w-2/3 space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="text-emerald-500 w-6 h-6" />
                        <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm">
                          Match Found
                        </span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-stone-900">
                        {result.name}
                      </h2>
                      <p className="text-stone-500 italic font-serif">
                        {result.scientificName}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-xl border-l-4 ${
                        result.biodiversityRisk === "High"
                          ? "bg-rose-50 border-rose-500 text-rose-800"
                          : result.biodiversityRisk === "Medium"
                            ? "bg-amber-50 border-amber-500 text-amber-800"
                            : "bg-emerald-50 border-emerald-500 text-emerald-800"
                      }`}
                    >
                      <div className="flex gap-3">
                        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold mb-1">
                            {result.biodiversityRisk} Biodiversity Risk
                          </h4>
                          <p className="text-sm opacity-90">
                            {result.legalAlerts[0]}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
                        Quick Health Check
                      </h3>
                      <ul className="space-y-2">
                        {result.healthChecklist.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-stone-700 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to={`/species/${result.id}`}
                      className="block text-center w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition shadow-lg"
                    >
                      View Full Care Guide
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add global style for the scanning animation */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scan-line {
          animation: scan 2s linear infinite;
          background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.5), transparent);
        }
      `}</style>
    </div>
  );
}
