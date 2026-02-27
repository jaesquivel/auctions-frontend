'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, Pencil, Trash2, Save, Check, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { SavedFilter } from './useSavedFilters';

interface SavedFiltersDropdownProps {
  savedFilters: SavedFilter[];
  activeId: string | null;
  onLoad: (filter: SavedFilter) => void;
  onSave: (name: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

export function SavedFiltersDropdown({
  savedFilters,
  activeId,
  onLoad,
  onSave,
  onRename,
  onDelete,
}: SavedFiltersDropdownProps) {
  const t = useTranslations('common.filters');
  const [open, setOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const activeFilter = savedFilters.find((f) => f.id === activeId);

  const handleSave = () => {
    const name = saveName.trim();
    if (!name) return;
    onSave(name);
    setSaveName('');
  };

  const handleStartRename = (filter: SavedFilter) => {
    setRenamingId(filter.id);
    setRenameValue(filter.name);
  };

  const handleConfirmRename = () => {
    if (!renamingId || !renameValue.trim()) return;
    onRename(renamingId, renameValue.trim());
    setRenamingId(null);
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) setRenamingId(null);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs hover:bg-accent/50 transition-colors min-w-[160px] max-w-[240px]"
        >
          <span className={cn('flex-1 text-left truncate', !activeFilter && 'text-muted-foreground')}>
            {activeFilter ? activeFilter.name : t('savedFilters')}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2 space-y-2" onWheel={(e) => e.stopPropagation()}>
        <div className="flex gap-1">
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={t('filterNamePlaceholder')}
            className="h-7 text-xs"
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            disabled={!saveName.trim()}
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5" />
          </Button>
        </div>

        {savedFilters.length > 0 ? (
          <>
            <div className="h-px bg-border" />
            <div className="space-y-0.5 max-h-52 overflow-y-auto">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className={cn(
                    'flex items-center gap-1 rounded-md px-1 group',
                    activeId === filter.id && 'bg-accent/50'
                  )}
                >
                  {renamingId === filter.id ? (
                    <>
                      <Input
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="h-6 text-xs flex-1 min-w-0"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleConfirmRename();
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                      />
                      <button
                        type="button"
                        className="p-0.5 text-primary shrink-0"
                        onClick={handleConfirmRename}
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="p-0.5 text-muted-foreground shrink-0"
                        onClick={() => setRenamingId(null)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={cn(
                          'flex-1 text-left text-xs py-1.5 truncate min-w-0',
                          activeId === filter.id ? 'font-medium text-primary' : 'text-foreground'
                        )}
                        onClick={() => { onLoad(filter); setOpen(false); }}
                      >
                        {filter.name}
                      </button>
                      <button
                        type="button"
                        className="p-0.5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => { e.stopPropagation(); handleStartRename(filter); }}
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="p-0.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                        onClick={(e) => { e.stopPropagation(); onDelete(filter.id); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-1">{t('noSavedFilters')}</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
