// presentation/admin/media/MediaPicker.hooks.ts
// Hook managing local file selection, instant object URL preview, and edge upload dispatch.
// Zero-debounce, strictly accessible, and memory-safe object URL cleanup.

import { useCallback, useEffect, useState } from "react";
import type { IUploadMediaUseCase } from "../../../application/use-cases/media/UploadMediaUseCase";
import { DI_TOKENS } from "../../../infrastructure/di/tokens";
import { useContainer } from "../../shared/useContainer";
import type { MediaPickerProps, MediaPickerViewModel } from "./MediaPicker.types";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
];

export function useMediaPicker({
  isOpen,
  onClose,
  onSuccess,
  targetFolder = "sachin-shakya/general",
  usageRef,
}: MediaPickerProps): MediaPickerViewModel {
  const uploadMedia = useContainer<IUploadMediaUseCase>(DI_TOKENS.UploadMedia);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState<string>("");
  const [folder, setFolder] = useState<string>(targetFolder);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear preview URL on unmount or reset
  const revokeCurrentPreview = useCallback((url: string | null) => {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleClearSelection = useCallback(() => {
    setPreviewUrl((prev) => {
      revokeCurrentPreview(prev);
      return null;
    });
    setSelectedFile(null);
    setErrorMessage(null);
  }, [revokeCurrentPreview]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      handleClearSelection();
      setAltText("");
      setFolder(targetFolder);
      setIsUploading(false);
      setErrorMessage(null);
    }
  }, [isOpen, targetFolder, handleClearSelection]);

  const validateAndSelectFile = useCallback(
    (file: File) => {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setErrorMessage(
          "Unsupported file format. Please choose a PNG, JPEG, WebP, SVG, GIF, or PDF."
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
        );
        return;
      }

      setErrorMessage(null);
      setSelectedFile(file);

      // Instant client-side preview via object URL
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl((prev) => {
          revokeCurrentPreview(prev);
          return objectUrl;
        });
      } else {
        setPreviewUrl(null);
      }

      // Default alt text from file name without extension
      const defaultAlt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
      setAltText((prev) => (prev ? prev : defaultAlt));
    },
    [revokeCurrentPreview]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [validateAndSelectFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [validateAndSelectFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleAltChange = useCallback((val: string) => {
    setAltText(val);
    setErrorMessage(null);
  }, []);

  const handleFolderChange = useCallback((val: string) => {
    setFolder(val);
  }, []);

  const handleUpload = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedFile) {
        setErrorMessage("Please select a file to upload.");
        return;
      }

      setIsUploading(true);
      setErrorMessage(null);

      try {
        const asset = await uploadMedia.execute({
          file: selectedFile,
          folder,
          altText: altText.trim(),
          usageRef,
        });

        onSuccess?.(asset);
        onClose();
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to upload media asset to Cloudinary."
        );
      } finally {
        setIsUploading(false);
      }
    },
    [selectedFile, folder, altText, usageRef, uploadMedia, onSuccess, onClose]
  );

  return {
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
  };
}
