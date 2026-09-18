// presentation/admin/media/MediaPicker.types.ts
// Type contracts for the MediaPicker component and modal dialog.

import type React from "react";
import type { MediaAsset } from "../../../domain/entities/content/MediaAsset";

export interface MediaPickerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: (asset: MediaAsset) => void;
  readonly targetFolder?: string;
  readonly usageRef?: string;
}

export interface MediaPickerViewModel {
  readonly selectedFile: File | null;
  readonly previewUrl: string | null;
  readonly altText: string;
  readonly folder: string;
  readonly isUploading: boolean;
  readonly errorMessage: string | null;
  readonly handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleDrop: (e: React.DragEvent) => void;
  readonly handleDragOver: (e: React.DragEvent) => void;
  readonly handleAltChange: (val: string) => void;
  readonly handleFolderChange: (val: string) => void;
  readonly handleUpload: (e: React.FormEvent) => Promise<void>;
  readonly handleClearSelection: () => void;
}
