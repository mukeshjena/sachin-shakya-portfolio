// presentation/admin/dashboard/tabs/media/MediaTab.tsx
// Media assets manager tab with real-time Cloudinary asset grid and cascade deletion.
// Compact DIIRA-style card grid architecture (aspect-[4/3], format/size badges, hover actions).
// Strictly shadow-free instrument panel aesthetic with zero emojis and custom ConfirmDialog.

import type React from "react";
import { useMemo, useState } from "react";
import {
  IoCheckmarkOutline,
  IoCopyOutline,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoImageOutline,
} from "react-icons/io5";
import type { MediaAsset } from "../../../../../domain/entities/content/MediaAsset";
import { ConfirmDialog } from "../../../../shared/confirm-dialog/ConfirmDialog";
import { ThreeDotMenu } from "../../../../shared/menu/ThreeDotMenu";

export interface MediaTabProps {
  readonly mediaAssets: readonly MediaAsset[];
  readonly onOpenMediaPicker: () => void;
  readonly onDeleteMedia: (id: string, publicId: string) => Promise<void>;
}

export const MediaTab: React.FC<MediaTabProps> = ({
  mediaAssets,
  onOpenMediaPicker,
  onDeleteMedia,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const filteredAssets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return mediaAssets;
    return mediaAssets.filter(
      (asset) =>
        asset.publicId.toLowerCase().includes(q) ||
        asset.altText.toLowerCase().includes(q) ||
        asset.folder.toLowerCase().includes(q)
    );
  }, [mediaAssets, searchQuery]);

  const handleCopyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopiedId(asset.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteMedia(assetToDelete.id, assetToDelete.publicId);
      setAssetToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--cyan)]">
              <IoImageOutline className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold tracking-tight text-[var(--paper)]">
              Media Asset Vault
            </h3>
          </div>
          <p className="text-xs text-[var(--mist)] mt-1">
            Edge-signed media library with real-time asset tracking and cascade deletion.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMediaPicker}
          className="px-4 py-2 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-950)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer shrink-0"
        >
          + Upload Asset
        </button>
      </div>

      {/* Search Filter Strip */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--ink-850)] border border-[var(--line)] gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter assets by public ID, alt description, or folder..."
          className="w-full max-w-md px-3.5 py-2 rounded-lg bg-[var(--ink-800)] border border-[var(--line)] text-xs text-[var(--paper)] focus:outline-none focus:border-[var(--cyan)] transition-colors"
        />
        <div className="text-xs font-mono text-[var(--mist-dim)] shrink-0">
          Showing {filteredAssets.length} of {mediaAssets.length} assets
        </div>
      </div>

      {/* Asset Grid — DIIRA Parity: Compact Multi-Column Grid */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[var(--ink-850)] border border-[var(--line)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--ink-800)] border border-[var(--line)] flex items-center justify-center text-[var(--mist-dim)] mx-auto mb-3">
            <IoImageOutline className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-[var(--paper)]">No media assets found</p>
          <p className="text-xs text-[var(--mist-dim)] font-mono mt-1">
            {searchQuery
              ? "No assets match your search query."
              : "Upload an asset to begin building your media library."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
          {filteredAssets.map((asset) => {
            const isCopied = copiedId === asset.id;
            const fileSizeKb = asset.bytes ? (asset.bytes / 1024).toFixed(0) : null;
            const isPdf =
              asset.format?.toLowerCase() === "pdf" || asset.url.toLowerCase().endsWith(".pdf");
            const fileName = asset.publicId.split("/").pop() || asset.publicId;

            return (
              <div
                key={asset.id}
                className="group rounded-xl bg-[var(--ink-850)] border border-[var(--line)] flex flex-col justify-between hover:border-[var(--cyan)]/40 transition-colors relative overflow-visible"
              >
                {/* Thumbnail Container — aspect-[4/3] (DIIRA Parity) */}
                <div className="relative aspect-[4/3] w-full bg-[var(--ink-900)] border-b border-[var(--line)] rounded-t-xl flex items-center justify-center overflow-hidden">
                  {isPdf ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-[var(--ink-900)] space-y-1.5 select-none">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <IoDocumentTextOutline className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-red-400 font-semibold">
                        PDF
                      </span>
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.altText || asset.publicId}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-t-xl group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  )}

                  {/* Top Badges (Format & Size) */}
                  <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none gap-1 z-10">
                    <span className="px-1.5 py-0.5 rounded bg-[var(--ink-900)]/90 backdrop-blur-sm border border-[var(--line)] text-[8px] font-mono uppercase font-bold text-[var(--cyan)]">
                      {asset.format || (isPdf ? "PDF" : "IMG")}
                    </span>
                    {fileSizeKb && (
                      <span className="px-1.5 py-0.5 rounded bg-[var(--ink-900)]/90 backdrop-blur-sm border border-[var(--line)] text-[8px] font-mono text-[var(--mist-dim)] tabular-nums">
                        {fileSizeKb}K
                      </span>
                    )}
                  </div>

                  {/* Hover Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2 p-2">
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full border border-[var(--line)] bg-[var(--ink-900)]/90 text-[var(--paper)] hover:text-[var(--cyan)] hover:border-[var(--cyan)] transition-colors"
                      title="Open full size"
                    >
                      <IoEyeOutline className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-2.5 space-y-1.5">
                  <div
                    className="text-[11px] font-mono font-semibold text-[var(--paper)] truncate"
                    title={fileName}
                  >
                    {fileName}
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-[var(--mist-dim)] pt-1 border-t border-[var(--line-soft)]">
                    <span className="truncate">
                      {asset.width && asset.height ? `${asset.width}x${asset.height}` : "Document"}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(asset)}
                        className="text-[var(--cyan)] hover:underline cursor-pointer"
                        title="Copy URL"
                      >
                        {isCopied ? (
                          <IoCheckmarkOutline className="w-3 h-3 text-[var(--live)]" />
                        ) : (
                          <IoCopyOutline className="w-3 h-3" />
                        )}
                      </button>

                      <ThreeDotMenu
                        actions={[
                          {
                            id: `copy-${asset.id}`,
                            label: "Copy URL",
                            onClick: () => handleCopyUrl(asset),
                          },
                          {
                            id: `open-${asset.id}`,
                            label: "Open in Tab",
                            onClick: () => window.open(asset.url, "_blank"),
                          },
                          {
                            id: `delete-${asset.id}`,
                            label: "Delete Asset",
                            danger: true,
                            onClick: () => setAssetToDelete(asset),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(assetToDelete)}
        title="Delete Media Asset"
        message={`Are you sure you want to permanently delete "${assetToDelete?.publicId}" from Cloudinary and media catalog?\n\nThis action cannot be undone.`}
        confirmLabel="Delete Asset"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setAssetToDelete(null)}
      />
    </div>
  );
};
