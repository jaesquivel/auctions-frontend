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
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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
    },
  ];

  const openLightbox = (image: PropertyImage) => {
    const idx = images.findIndex((img) => img.id === image.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const handleUploadFile = async (file: File): Promise<PropertyImage | null> => {
    if (!propertyId) return null;
    setUploading(true);
    try {
      const image = await propertiesService.uploadImage(propertyId, file);
      onRefresh?.();
      return image;
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleUploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          className="hidden"
          onChange={handleUpload}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || !propertyId}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-1.5" />
          {uploading ? t('uploading') : t('uploadImage')}
        </Button>
      </div>

      <div className="h-64">
        <DataGrid<PropertyImage>
          columns={columns}
          data={images}
          keyField="id"
          rowHeight={72}
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