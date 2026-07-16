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

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }

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
        description: `${json.data.description} · ₹${json.data.amount}`,
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
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-700">AI Receipt Scanner</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[11px] font-medium">Gemini</span>
        </div>
        {preview && (
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />
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
            className="flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-all">
              <Camera className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                Click or drag a receipt photo
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPG · PNG · WEBP · up to 10 MB
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Photo
            </button>
          </div>
        ) : (
          // Preview + scanning state
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image preview */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 w-full sm:w-36 h-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Receipt preview"
                className="w-full h-full object-cover"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              )}
            </div>

            {/* Scan result or loading */}
            <div className="flex-1 min-w-0">
              {isScanning ? (
                <div className="flex flex-col gap-2 h-full justify-center">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Analyzing receipt...</span>
                  </div>
                  <div className="space-y-1.5">
                    {["Extracting amount", "Reading date", "Identifying merchant", "Mapping category"].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                        {s}...
                      </div>
                    ))}
                  </div>
                </div>
              ) : scannedData ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Scan complete — form filled!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Amount", value: `₹${scannedData.amount}` },
                      { label: "Date", value: scannedData.date },
                      { label: "Merchant", value: scannedData.description },
                      { label: "Category", value: scannedData.category },
                    ].map((item) => (
                      <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.label}</p>
                        <p className="text-xs text-slate-700 truncate mt-0.5 font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mt-1 text-xs text-slate-400 hover:text-blue-500 transition-colors"
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
