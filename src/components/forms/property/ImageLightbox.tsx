'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Trash2, Upload, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { propertiesService } from '@/services/properties';
import type { PropertyImage } from '@/types';

interface ImageLightboxProps {
  images: PropertyImage[];
  initialIndex: number;
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after confirmation — should perform the delete and refresh */
  onDelete: (image: PropertyImage) => Promise<void>;
  /** Called with the selected file — should upload and refresh. Returns the new image or null. */
  onUpload: (file: File) => Promise<PropertyImage | null>;
}

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const ZOOM_STEP = 1.25;

export function ImageLightbox({
  images,
  initialIndex,
  propertyId,
  open,
  onOpenChange,
  onDelete,
  onUpload,
}: ImageLightboxProps) {
  const t = useTranslations('properties.form');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [fullUrls, setFullUrls] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingNavId, setPendingNavId] = useState<string | null>(null);

  const currentImage = images[index] ?? null;
  const fullUrl = currentImage ? fullUrls[currentImage.id] : undefined;

  // Reset when lightbox opens with a new initial index
  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);

  // Keep index in bounds when images array changes (e.g. after delete)
  useEffect(() => {
    if (!open) return;
    if (images.length === 0) {
      onOpenChange(false);
    } else {
      setIndex((i) => Math.min(i, images.length - 1));
    }
  }, [images.length, open]);

  // Load full image for current index
  useEffect(() => {
    if (!currentImage || !open || fullUrls[currentImage.id] || loadingId === currentImage.id) return;

    let cancelled = false;
    setLoadingId(currentImage.id);
    propertiesService
      .getImageUrl(propertyId, currentImage.id)
      .then((url) => {
        if (!cancelled) setFullUrls((prev) => ({ ...prev, [currentImage.id]: url }));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingId(null);
      });

    return () => { cancelled = true; };
  }, [currentImage?.id, open]);

  // Preload adjacent images silently
  useEffect(() => {
    if (!open) return;
    [index - 1, index + 1].forEach((i) => {
      const img = images[i];
      if (img && !fullUrls[img.id]) {
        propertiesService
          .getImageUrl(propertyId, img.id)
          .then((url) => setFullUrls((prev) => ({ ...prev, [img.id]: url })))
          .catch(() => {});
      }
    });
  }, [index, open]);

  // Navigate to newly uploaded image once it appears in the images array
  useEffect(() => {
    if (!pendingNavId) return;
    const newIdx = images.findIndex((img) => img.id === pendingNavId);
    if (newIdx >= 0) {
      setIndex(newIdx);
      setZoom(1);
      setPendingNavId(null);
    }
  }, [images, pendingNavId]);

  // Revoke blob URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(fullUrls).forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const goPrev = () => { if (index > 0) { setIndex(index - 1); setZoom(1); } };
  const goNext = () => { if (index < images.length - 1) { setIndex(index + 1); setZoom(1); } };
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z * ZOOM_STEP).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z / ZOOM_STEP).toFixed(2)));
  const resetZoom = () => setZoom(1);

  const handleDelete = async () => {
    if (!currentImage) return;
    if (!confirm(t('confirmDeleteImage', { name: currentImage.name ?? currentImage.id }))) return;
    setDeleting(true);
    try {
      await onDelete(currentImage);
    } finally {
      setDeleting(false);
    }
  };

  const handleUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      const results = await Promise.all(files.map((f) => onUpload(f)));
      const lastNew = results.filter(Boolean).at(-1);
      if (lastNew?.id) setPendingNavId(lastNew.id);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!currentImage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="inset-0 top-0 left-0 translate-x-0 translate-y-0 max-w-none sm:max-w-none w-screen h-screen rounded-none p-0 flex flex-col gap-0"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b shrink-0 gap-4">
          <span className="text-sm font-medium truncate">{currentImage.name}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">
              {index + 1} / {images.length}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image area */}
        <div className="flex-1 min-h-0 overflow-auto bg-black/85 flex items-center justify-center p-4">
          {loadingId === currentImage.id ? (
            <p className="text-sm text-white/60">{t('loadingImage')}</p>
          ) : fullUrl ? (
            <img
              src={fullUrl}
              alt={currentImage.name}
              className="object-contain cursor-zoom-in"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center',
                transition: 'transform 0.15s ease',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
              onClick={zoomIn}
            />
          ) : (
            <p className="text-sm text-white/60">{t('imageNotAvailable')}</p>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-4 py-2 border-t shrink-0 gap-4 flex-wrap">
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={index === 0}
              onClick={goPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={index === images.length - 1}
              onClick={goNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={zoom <= ZOOM_MIN}
              onClick={zoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-14 text-xs tabular-nums" onClick={resetZoom}>
              {Math.round(zoom * 100)}%
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={zoom >= ZOOM_MAX}
              onClick={zoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUploadChange}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              {uploading ? t('uploading') : t('uploadImage')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive border-destructive/40"
              disabled={deleting}
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {t('deleteImage')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}