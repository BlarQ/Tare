'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Loader2, Sparkles, Image as ImageIcon, Plus } from 'lucide-react';
import { compressImage } from '@/lib/image-compressor';

interface ImageUploaderProps {
  label: string;
  value?: string;
  values?: string[];
  multiple?: boolean;
  onChange?: (url: string) => void;
  onMultipleChange?: (urls: string[]) => void;
  hint?: string;
}

export default function ImageUploader({
  label,
  value = '',
  values = [],
  multiple = false,
  onChange,
  onMultipleChange,
  hint = 'Supports JPG, PNG, WebP (Images >5MB auto-compressed)',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    setStatusMessage('Preparing & optimizing images...');

    try {
      const filesToUpload: File[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const rawFile = fileList[i];
        
        // Check if compression is needed (> 5MB or large image)
        if (rawFile.size > 5 * 1024 * 1024) {
          const originalMb = (rawFile.size / (1024 * 1024)).toFixed(1);
          setStatusMessage(`Optimizing ${rawFile.name} (${originalMb}MB)...`);
          const { file: compressed, compressedSizeMb, reductionPercentage } = await compressImage(rawFile, 5);
          setStatusMessage(`Compressed to ${compressedSizeMb.toFixed(1)}MB (-${reductionPercentage}%)`);
          filesToUpload.push(compressed);
        } else {
          filesToUpload.push(rawFile);
        }
      }

      setStatusMessage('Uploading to Cloud Storage...');
      const formData = new FormData();
      if (multiple) {
        filesToUpload.forEach((f) => formData.append('files', f));
      } else {
        formData.append('file', filesToUpload[0]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        if (multiple && onMultipleChange) {
          const newUrls = data.urls || [data.url];
          onMultipleChange([...values, ...newUrls]);
          setStatusMessage(`✓ Uploaded ${newUrls.length} images successfully`);
        } else if (onChange) {
          onChange(data.url);
          setStatusMessage('✓ Image uploaded successfully');
        }
      } else {
        setStatusMessage(`Upload failed: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatusMessage('Upload error, please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setStatusMessage(null), 4000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveSingle = () => {
    if (onChange) onChange('');
  };

  const handleRemoveGalleryItem = (indexToRemove: number) => {
    if (onMultipleChange) {
      const updated = values.filter((_, idx) => idx !== indexToRemove);
      onMultipleChange(updated);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block font-mono text-xs text-neutral-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="font-mono text-[10px] text-neutral-500">{hint}</span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* MULTIPLE GALLERY IMAGES VIEW */}
      {multiple ? (
        <div className="space-y-3">
          {/* Thumbnails Grid */}
          {values && values.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 p-3 bg-black/60 border border-white/10 rounded-xs">
              {values.map((imgUrl, idx) => (
                <div key={idx} className="relative group h-24 rounded-xs overflow-hidden border border-white/15 bg-neutral-900">
                  <Image
                    src={imgUrl}
                    alt={`Gallery asset ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(idx)}
                      className="p-1.5 bg-red-950/90 text-red-300 hover:text-white rounded-full transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 text-[8px] font-mono text-neutral-300 rounded">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add More Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed p-4 rounded-xs text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              dragActive
                ? 'border-[#3ecf8e] bg-[#3ecf8e]/10'
                : 'border-white/20 bg-black/40 hover:border-[#d4af37] hover:bg-white/5'
            }`}
          >
            {isUploading ? (
              <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{statusMessage || 'Processing upload...'}</span>
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 group-hover:text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="font-mono text-xs text-neutral-300">
                  Click to select multiple photos or drag and drop
                </div>
                <div className="font-mono text-[10px] text-neutral-500">
                  High-res photos auto-optimized for ultra-fast loading
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* SINGLE IMAGE UPLOAD VIEW */
        <div className="space-y-2">
          {value ? (
            <div className="relative group flex items-center gap-4 p-3 bg-black border border-white/15 rounded-xs">
              <div className="relative w-20 h-20 rounded-xs overflow-hidden border border-white/15 bg-neutral-900 shrink-0">
                <Image
                  src={value}
                  alt="Uploaded preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-white truncate">{value}</div>
                <div className="font-mono text-[10px] text-[#3ecf8e] flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3" />
                  <span>Cloud Active Ready</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 border border-white/15 font-mono text-[10px] text-white rounded-xs transition-colors"
                  >
                    Replace Image
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveSingle}
                    className="px-3 py-1 bg-red-950/40 hover:bg-red-950 border border-red-500/30 font-mono text-[10px] text-red-300 rounded-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed p-6 rounded-xs text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
                dragActive
                  ? 'border-[#3ecf8e] bg-[#3ecf8e]/10'
                  : 'border-white/20 bg-black/40 hover:border-[#d4af37] hover:bg-white/5'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 text-xs font-mono text-[#d4af37]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{statusMessage || 'Processing upload...'}</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs text-white font-semibold">
                      Click to choose image
                    </span>
                    <span className="font-mono text-xs text-neutral-400"> or drag &amp; drop here</span>
                  </div>
                  <div className="font-mono text-[10px] text-neutral-500">
                    Auto-compresses large files (&gt;5MB) preserving full visual quality
                  </div>
                </>
              )}
            </div>
          )}

          {/* Upload Status Toast Message */}
          {statusMessage && (
            <div className="font-mono text-[10px] text-[#d4af37] flex items-center gap-1.5 px-2 py-1 bg-black/60 border border-white/10 rounded">
              <Sparkles className="w-3 h-3 text-[#dc5000]" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
