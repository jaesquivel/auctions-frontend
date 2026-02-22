'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataGrid } from '@/components/data-grid';
import type { ColumnDef } from '@/components/data-grid';
import { ImageLightbox } from './ImageLightbox';
import { propertiesService } from '@/services/properties';
import type { Property, PropertyImage } from '@/types';

interface PropertyImagesTabProps {
  property?: Property | null;
  propertyId?: string;
  onRefresh?: () => void;
}

export function PropertyImagesTab({ property, propertyId, onRefresh }: PropertyImagesTabProps) {
  const t = useTranslations('properties.form');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const images = property?.images ?? [];

  const columns: ColumnDef<PropertyImage>[] = [
    {
      id: 'thumbnail',
      header: t('imageThumbnail'),
      width: 80,
      align: 'center',
      accessorFn: (row) =>
        row.thumbnailUrl ? (
          <img src={row.thumbnailUrl} alt={row.name} className="max-h-16 max-w-16 object-contain rounded" />
        ) : (
          <span className="text-xs text-muted-foreground">{row.mimeType}</span>
        ),
    },
    {
      id: 'name',
      header: t('imageName'),
      accessorKey: 'name',
      grow: true,
    },
  ];

  const openLightbox = (image: PropertyImage) => {
    const idx = images.findIndex((img) => img.id === image.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length || !propertyId) return;
    setUploadingCount(files.length);
    try {
      await Promise.all(
        files.map((file) =>
          propertiesService.uploadImage(propertyId, file).finally(() =>
            setUploadingCount((c) => c - 1)
          )
        )
      );
      onRefresh?.();
    } finally {
      setUploadingCount(0);
    }
  };

  const handleUploadFile = async (file: File): Promise<PropertyImage | null> => {
    if (!propertyId) return null;
    const image = await propertiesService.uploadImage(propertyId, file);
    onRefresh?.();
    return image;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    await uploadFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (propertyId) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    await uploadFiles(files);
  };

  const handleDeleteImage = async (image: PropertyImage) => {
    if (!propertyId) return;
    await propertiesService.deleteImage(propertyId, image.id);
    onRefresh?.();
  };

  const handleGridDelete = async (image: PropertyImage) => {
    if (!propertyId) return;
    if (!confirm(t('confirmDeleteImage', { name: image.name ?? image.id }))) return;
    setDeletingId(image.id);
    try {
      await handleDeleteImage(image);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploadingCount > 0 || !propertyId}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-1.5" />
          {uploadingCount > 0 ? t('uploading') : t('uploadImage')}
        </Button>
      </div>

      <div
        className={`relative h-[calc(100vh-360px)] min-h-75 rounded-md transition-colors ${isDragOver ? 'ring-2 ring-primary ring-offset-1' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-primary/10 border-2 border-dashed border-primary pointer-events-none">
            <p className="text-sm font-medium text-primary">{t('dropImagesHere')}</p>
          </div>
        )}
        <DataGrid<PropertyImage>
          columns={columns}
          data={images}
          keyField="id"
          rowHeight={72}
          hideFooter
          actions={(row) => (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => openLightbox(row)}
                title={t('viewImage')}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                disabled={deletingId === row.id || !propertyId}
                onClick={() => handleGridDelete(row)}
                title={t('deleteImage')}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        />
      </div>

      {propertyId && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          propertyId={propertyId}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          onDelete={handleDeleteImage}
          onUpload={handleUploadFile}
        />
      )}
    </div>
  );
}