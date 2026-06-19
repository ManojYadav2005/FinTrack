"use client";

import { useRef, useState } from "react";
import { Camera, Upload, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setIsScanning(true);
    setScannedData(null);

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Scan failed");
      }

      setScannedData(json.data);
      onScanComplete(json.data);
      toast.success("Receipt scanned! Fields auto-filled ✓", {
        description: `${json.data.description} · $${json.data.amount}`,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not read receipt. Enter details manually.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setScannedData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-mono font-semibold text-slate-200">AI Receipt Scanner</span>
          <span className="sql-badge sql-badge-blue text-[10px]">Gemini Vision</span>
        </div>
        {preview && (
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-red-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {!preview ? (
          // Drop zone
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/60 hover:bg-blue-500/5 cursor-pointer transition-all duration-200 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-105 transition-all duration-200">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">
                Click or drag a receipt photo
              </p>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                JPG · PNG · WEBP · up to 10 MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>
            </div>
          </div>
        ) : (
          // Preview + scanning state
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image preview */}
            <div className={`relative rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 w-full sm:w-36 h-32 ${isScanning ? "scanner-overlay" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Receipt preview"
                className="w-full h-full object-cover"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Scan result or loading */}
            <div className="flex-1 min-w-0">
              {isScanning ? (
                <div className="flex flex-col gap-2 h-full justify-center">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-mono">Analyzing receipt with Gemini AI...</span>
                  </div>
                  <div className="space-y-1.5">
                    {["Extracting amount", "Reading date", "Identifying merchant", "Mapping category"].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        {s}...
                      </div>
                    ))}
                  </div>
                </div>
              ) : scannedData ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-mono font-semibold">Scan complete — form auto-filled!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "amount", value: `$${scannedData.amount}` },
                      { label: "date", value: scannedData.date },
                      { label: "merchant", value: scannedData.description },
                      { label: "category", value: scannedData.category },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-xs font-mono text-slate-200 truncate mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mt-1 text-xs font-mono text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    Scan another receipt →
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
