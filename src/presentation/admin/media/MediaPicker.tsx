// presentation/admin/media/MediaPicker.tsx
// Declarative media picker modal with instant client preview and Cloudinary edge upload.
// Strictly shadow-free instrument panel aesthetic with zero emojis.

import type React from "react";
import {
  IoCloseOutline,
  IoCloudUploadOutline,
  IoDocumentAttachOutline,
  IoImageOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { Select } from "../../shared/select/Select";
import { useMediaPicker } from "./MediaPicker.hooks";
import type { MediaPickerProps } from "./MediaPicker.types";

const FOLDER_OPTIONS = [
  { value: "sachin-shakya/general", label: "General Assets (sachin-shakya/general)" },
  { value: "sachin-shakya/logo", label: "Branding & Logo (sachin-shakya/logo)" },
  { value: "sachin-shakya/home/hero", label: "Home Hero Section (sachin-shakya/home/hero)" },
  {
    value: "sachin-shakya/home/experience",
    label: "Experience Timeline (sachin-shakya/home/experience)",
  },
  { value: "sachin-shakya/promo-popup", label: "Promo Popups (sachin-shakya/promo-popup)" },
];

export const MediaPicker: React.FC<MediaPickerProps> = (props) => {
  const { isOpen, onClose } = props;
  const {
    selectedFile,
    previewUrl,
    altText,
    folder,
    isUploading,
    errorMessage,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleAltChange,
    handleFolderChange,
    handleUpload,
    handleClearSelection,
  } = useMediaPicker(props);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-picker-title"
    >
      {/* Accessible Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-default border-none p-0 w-full h-full"
        onClick={onClose}
        aria-label="Close media picker overlay"
        tabIndex={-1}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl flex flex-col bg-[var(--ink-850)] border border-[var(--line)] rounded-2xl overflow-hidden z-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line-soft)] bg-[var(--ink-900)]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)]">
              <IoImageOutline className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="media-picker-title"
                className="text-base font-semibold text-[var(--paper)] tracking-tight"
              >
                Upload Media Asset
              </h2>
              <p className="text-xs text-[var(--mist-dim)] font-mono">
                Edge CDN media integration via secure gateway
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--mist)] hover:text-[var(--paper)] transition-colors"
            aria-label="Close modal"
          >
            <IoCloseOutline className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUpload} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          {!selectedFile ? (
            <section
              aria-label="Media file upload drop zone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-[var(--line)] hover:border-[var(--cyan)]/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors bg-[var(--ink-900)]/40 cursor-pointer relative"
            >
              <input
                id="media-file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,application/pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Choose image file to upload"
              />
              <div className="w-12 h-12 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] mb-3">
                <IoCloudUploadOutline className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-[var(--paper)]">
                Drag and drop your asset here, or click to browse
              </p>
              <p className="text-xs text-[var(--mist-dim)] font-mono mt-1">
                PNG, JPEG, WebP, SVG, GIF up to 10MB
              </p>
            </section>
          ) : (
            /* Selected File Preview Box */
            <div className="p-4 rounded-xl bg-[var(--ink-900)] border border-[var(--line)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Selected preview"
                    className="w-16 h-16 rounded-lg object-cover border border-[var(--line)] bg-[var(--ink-850)] shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[var(--ink-850)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)] shrink-0">
                    <IoDocumentAttachOutline className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-mono font-semibold text-[var(--paper)] truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--mist-dim)] mt-0.5">
                    {(selectedFile.size / 1024).toFixed(0)} KB &bull; {selectedFile.type}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearSelection}
                className="p-2 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] text-[var(--mist)] hover:text-red-400 hover:border-red-500/30 transition-colors shrink-0"
                aria-label="Clear selected file"
              >
                <IoTrashOutline className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Destination Folder Selector */}
          <div>
            <Select
              id="media-folder-select"
              label="Media Storage Directory"
              value={folder}
              options={FOLDER_OPTIONS}
              allowCustom={true}
              customPlaceholder="Select or type custom directory path..."
              onChange={(e) => handleFolderChange(e.target.value)}
              onCustomValueChange={(val) => handleFolderChange(val)}
            />
          </div>

          {/* Accessible Alt Text Input */}
          <div>
            <label
              htmlFor="media-alt-input"
              className="block text-xs font-mono uppercase tracking-wider text-[var(--mist)] mb-1.5"
            >
              Accessible Screen-Reader Description (alt text)
            </label>
            <input
              id="media-alt-input"
              type="text"
              required
              value={altText}
              onChange={(e) => handleAltChange(e.target.value)}
              placeholder="e.g. Lead Cloud Architect architecture topology"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] text-xs text-[var(--paper)] focus:outline-none focus:border-[var(--amber)] transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line-soft)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-transparent border border-[var(--line)] text-xs font-medium text-[var(--mist)] hover:text-[var(--paper)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 rounded-xl bg-[var(--amber)] text-[var(--ink-950)] text-xs font-semibold hover:bg-[var(--amber-deep)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? "Uploading Asset..." : "Upload Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
