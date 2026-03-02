'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  color: string;
  className?: string;
  onRemove?: () => void;
}

export function TagBadge({ name, color, className, onRemove }: TagBadgeProps) {
  // Calculate if we need light or dark text based on background color
  const isLightColor = (hexColor: string): boolean => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  const textColor = isLightColor(color) ? '#1a1a1a' : '#ffffff';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap',
        className
      )}
      style={{ backgroundColor: color, color: textColor }}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          className="opacity-60 hover:opacity-100 transition-opacity leading-none"
          style={{ color: textColor }}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

interface TagListProps {
  tags: Array<{ id: string; name: string; color: string }>;
  max?: number;
}

export function TagList({ tags, max = 2 }: TagListProps) {
  const visibleTags = tags.slice(0, max);
  const remainingCount = tags.length - max;

  return (
    <div className="flex items-center gap-1 overflow-hidden">
      {visibleTags.map((tag) => (
        <TagBadge key={tag.id} name={tag.name} color={tag.color} />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-muted-foreground">+{remainingCount}</span>
      )}
    </div>
  );
}