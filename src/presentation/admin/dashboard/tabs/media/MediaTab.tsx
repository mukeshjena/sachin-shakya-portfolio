// presentation/admin/dashboard/tabs/media/MediaTab.tsx
// Media assets manager tab with real-time Cloudinary asset grid and cascade deletion.
// Strictly shadow-free instrument panel aesthetic with zero emojis.

import type React from "react";
import { useMemo, useState } from "react";
import {
  IoCheckmarkOutline,
  IoCopyOutline,
  IoImageOutline,
  IoOpenOutline,
  IoTrashOutline,
} from "react-icons/io5";
import type { MediaAsset } from "../../../../../domain/entities/content/MediaAsset";
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
              Cloudinary Media Assets
            </h3>
          </div>
          <p className="text-xs text-[var(--mist)] mt-1">
            Edge-signed media library with real-time Cloudinary asset tracking and cascade deletion.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenMediaPicker}
          className="px-4 py-2.5 rounded-xl bg-[var(--amber)] hover:bg-[var(--amber-deep)] text-[var(--ink-950)] text-xs font-mono font-semibold tracking-wide transition-colors cursor-pointer shrink-0"
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

      {/* Asset Grid */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const isCopied = copiedId === asset.id;
            const fileSizeKb = asset.bytes ? (asset.bytes / 1024).toFixed(0) : null;

            return (
              <div
                key={asset.id}
                className="group rounded-2xl bg-[var(--ink-850)] border border-[var(--line)] overflow-hidden flex flex-col justify-between hover:border-[var(--cyan)]/40 transition-colors"
              >
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-video w-full bg-[var(--ink-900)] border-b border-[var(--line)] overflow-hidden flex items-center justify-center">
                  <img
                    src={asset.url}
                    alt={asset.altText || asset.publicId}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {/* Format & Size Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {asset.format && (
                      <span className="px-2 py-0.5 rounded bg-[var(--ink-900)]/90 backdrop-blur-sm border border-[var(--line)] text-[9px] font-mono uppercase tracking-wider text-[var(--cyan)]">
                        {asset.format}
                      </span>
                    )}
                    {fileSizeKb && (
                      <span className="px-2 py-0.5 rounded bg-[var(--ink-900)]/90 backdrop-blur-sm border border-[var(--line)] text-[9px] font-mono text-[var(--mist-dim)]">
                        {fileSizeKb} KB
                      </span>
                    )}
                  </div>

                  {/* Context Menu */}
                  <div className="absolute top-2.5 right-2.5">
                    <ThreeDotMenu
                      actions={[
                        {
                          id: `copy-${asset.id}`,
                          label: "Copy CDN URL",
                          onClick: () => handleCopyUrl(asset),
                        },
                        {
                          id: `open-${asset.id}`,
                          label: "Open in New Tab",
                          onClick: () => window.open(asset.url, "_blank"),
                        },
                        {
                          id: `delete-${asset.id}`,
                          label: "Delete from Cloudinary",
                          danger: true,
                          onClick: () => {
                            const confirmed = window.confirm(
                              `Permanently delete "${asset.publicId}" from Cloudinary?`
                            );
                            if (confirmed) {
                              onDeleteMedia(asset.id, asset.publicId);
                            }
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs font-mono font-semibold text-[var(--paper)] truncate">
                      {asset.publicId.split("/").pop()}
                    </div>
                    <div className="text-[11px] text-[var(--mist)] mt-1 line-clamp-1">
                      {asset.altText || "No alt description"}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--mist-dim)] mt-1 truncate">
                      {asset.folder}
                    </div>
                  </div>

                  {/* Card Bottom Strip */}
                  <div className="pt-3 border-t border-[var(--line-soft)] flex items-center justify-between text-[10px] font-mono text-[var(--mist-dim)]">
                    <span>
                      {asset.width && asset.height
                        ? `${asset.width}x${asset.height} px`
                        : "Uploaded asset"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(asset)}
                        className="inline-flex items-center gap-1 text-[var(--cyan)] hover:underline cursor-pointer"
                        title="Copy CDN URL"
                      >
                        {isCopied ? (
                          <>
                            <IoCheckmarkOutline className="w-3 h-3 text-[var(--live)]" />
                            <span className="text-[var(--live)]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <IoCopyOutline className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-[var(--mist)] hover:text-[var(--paper)]"
                        title="Open image"
                      >
                        <IoOpenOutline className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            `Permanently delete "${asset.publicId}" from Cloudinary?`
                          );
                          if (confirmed) {
                            onDeleteMedia(asset.id, asset.publicId);
                          }
                        }}
                        className="p-1 rounded text-[var(--mist)] hover:text-red-400"
                        title="Delete asset"
                      >
                        <IoTrashOutline className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
