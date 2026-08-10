import React, { useRef, useState, ChangeEvent, DragEvent } from 'react';
import { Upload, Camera, Sliders, RotateCw, ZoomIn, Move, Sparkles, AlertCircle, Check } from 'lucide-react';
import { processUploadedFile } from '../lib/imageProcessing';
import { PhotoTransform } from '../types';

interface PhotoUploaderProps {
  photoUrl: string | null;
  transform: PhotoTransform;
  onPhotoSelected: (url: string) => void;
  onTransformChange: (transform: PhotoTransform) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  transform,
  onPhotoSelected,
  onTransformChange,
  onNext,
  onBack,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdjustments, setShowAdjustments] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await processUploadedFile(file);
      onPhotoSelected(result.dataUrl);
      // Reset transform defaults
      onTransformChange({
        zoom: 1,
        panX: 0,
        panY: 0,
        rotation: 0,
        filter: 'none',
      });
    } catch (err: any) {
      console.error('Photo upload error:', err);
      setErrorMessage(
        'Could not process that photo. Please try another JPG, PNG, or iPhone HEIC file.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRotate = () => {
    onTransformChange({
      ...transform,
      rotation: (transform.rotation + 90) % 360,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {/* Step Header */}
      <div className="mb-6 border-b border-[#053d28] pb-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs text-yellow-400 font-bold">STEP 01 OF 02</span>
          <h2 className="font-space font-extrabold text-2xl sm:text-3xl text-white uppercase mt-0.5">
            UPLOAD YOUR PHOTO
          </h2>
          <p className="font-sans text-sm text-emerald-200/80 mt-1">
            Pick a selfie or portrait. Works automatically with any photo format (JPG, PNG, iPhone HEIC).
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Upload Zone */}
      {!photoUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#facc15] bg-[#facc15]/10'
              : 'border-emerald-800/80 hover:border-[#facc15] bg-[#032b1d] hover:bg-[#043625]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onInputChange}
            accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={onInputChange}
            accept="image/*"
            capture="user"
            className="hidden"
          />

          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-900/60 rounded-2xl flex items-center justify-center text-[#facc15] border border-emerald-500/30">
            {isProcessing ? (
              <div className="w-8 h-8 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <h3 className="font-space font-bold text-lg text-white mb-2">
            {isProcessing ? 'PROCESSING PHOTO...' : 'DROP IMAGE OR CLICK TO SELECT'}
          </h3>
          <p className="font-sans text-xs text-emerald-200/70 max-w-sm mx-auto mb-6">
            Most common image formats work—no manual crop needed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-5 py-2.5 bg-[#facc15] hover:bg-yellow-300 text-black font-space font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md"
            >
              SELECT FILE
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="px-5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-white border border-emerald-700/60 font-space font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#facc15]" />
              TAKE PHOTO
            </button>
          </div>
        </div>
      ) : (
        /* Photo Uploaded Preview & Adjustments */
        <div className="space-y-6">
          <div className="bg-[#032b1d] border border-emerald-800/60 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-emerald-300 flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4 text-[#facc15]" />
                PHOTO READY
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-mono text-[#facc15] hover:underline cursor-pointer"
              >
                Change Photo
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={onInputChange}
              accept="image/jpeg,image/png,image/heic,image/heif,image/webp"
              className="hidden"
            />

            {/* Interactive Photo Preview Window */}
            <div className="relative w-full aspect-[4/3] bg-black rounded-xl border border-emerald-800/60 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Uploaded Builder"
                  style={{
                    transform: `scale(${transform.zoom}) translate(${transform.panX}px, ${transform.panY}px) rotate(${transform.rotation}deg)`,
                    filter:
                      transform.filter === 'contrast'
                        ? 'contrast(130%)'
                        : transform.filter === 'goa-warmth'
                        ? 'sepia(30%) contrast(115%)'
                        : transform.filter === 'cyber-cyan'
                        ? 'hue-rotate(150deg)'
                        : transform.filter === 'mono'
                        ? 'grayscale(100%)'
                        : 'none',
                  }}
                  className="w-full h-full object-cover transition-transform duration-75"
                />
              </div>

              {/* Corner crosshairs overlay */}
              <div className="absolute top-2 left-2 text-[#facc15] font-mono text-[10px] bg-black/80 px-2 py-0.5 border border-[#facc15]/30 rounded-md">
                FRAME // 01
              </div>
              <div className="absolute bottom-2 right-2 text-white font-mono text-[10px] bg-black/80 px-2 py-0.5 border border-emerald-800 rounded-md">
                1600 × 2500 PASSPORT
              </div>
            </div>

            {/* Quick Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustments(!showAdjustments)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border flex items-center gap-1.5 cursor-pointer ${
                  showAdjustments
                    ? 'border-[#facc15] text-[#facc15] bg-[#facc15]/10'
                    : 'border-emerald-700/80 text-emerald-200 hover:border-emerald-500'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdjustments ? 'Hide Reframing' : 'Adjust Frame / Crop'}</span>
              </button>

              <button
                type="button"
                onClick={handleRotate}
                className="text-xs font-mono px-3 py-1.5 rounded-lg border border-emerald-700/80 text-emerald-200 hover:border-emerald-500 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate ({transform.rotation}°)</span>
              </button>
            </div>

            {/* Optional Slider Controls */}
            {showAdjustments && (
              <div className="p-4 bg-[#022015] border border-emerald-800/80 rounded-xl space-y-4 font-mono text-xs text-emerald-200">
                {/* Zoom */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ZoomIn className="w-3.5 h-3.5 text-[#facc15]" /> Zoom
                    </span>
                    <span>{transform.zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={transform.zoom}
                    onChange={(e) =>
                      onTransformChange({ ...transform, zoom: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#facc15] cursor-pointer"
                  />
                </div>

                {/* Pan X */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Move className="w-3.5 h-3.5 text-[#facc15]" /> Pan Horizontal
                    </span>
                    <span>{transform.panX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="2"
                    value={transform.panX}
                    onChange={(e) =>
                      onTransformChange({ ...transform, panX: parseInt(e.target.value) })
                    }
                    className="w-full accent-[#facc15] cursor-pointer"
                  />
                </div>

                {/* Pan Y */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Move className="w-3.5 h-3.5 text-[#facc15]" /> Pan Vertical
                    </span>
                    <span>{transform.panY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="2"
                    value={transform.panY}
                    onChange={(e) =>
                      onTransformChange({ ...transform, panY: parseInt(e.target.value) })
                    }
                    className="w-full accent-[#facc15] cursor-pointer"
                  />
                </div>

                {/* Photo Filter */}
                <div>
                  <div className="text-emerald-300 mb-2">Photo Filter / Contrast:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'none', label: 'Normal' },
                      { id: 'contrast', label: 'High Contrast' },
                      { id: 'goa-warmth', label: 'Goa Warmth' },
                      { id: 'cyber-cyan', label: 'Cyber Cyan' },
                      { id: 'mono', label: 'B&W Mono' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() =>
                          onTransformChange({ ...transform, filter: f.id as any })
                        }
                        className={`py-1.5 px-2 rounded-lg border text-[11px] font-mono cursor-pointer ${
                          transform.filter === f.id
                            ? 'border-[#facc15] bg-[#facc15]/20 text-white font-bold'
                            : 'border-emerald-800 bg-emerald-950 text-emerald-300 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBack}
              className="px-5 py-3 border border-emerald-700/80 hover:border-emerald-500 text-emerald-200 font-space font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              BACK
            </button>

            <button
              onClick={onNext}
              className="px-8 py-3.5 bg-[#facc15] hover:bg-yellow-300 text-black font-space font-extrabold text-sm uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
            >
              <span>CONTINUE TO DETAILS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
