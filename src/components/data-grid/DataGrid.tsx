"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataGridToolbar } from "./DataGridToolbar";
import type { DataGridProps, ColumnDef, SortState } from "./types";

const MIN_COLUMN_WIDTH = 50;

export function DataGrid<T>({
  columns,
  data,
  keyField,
  loading = false,
  pagination,
  onPageChange,
  onRowSelect,
  selectedRow,
  actions,
  onFilter,
  onEditFilters,
  onDownload,
  onReload,
  sort,
  onSort,
}: DataGridProps<T>) {
  const t = useTranslations("common");

  // Track column widths (initialized from column definitions)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
    columns.reduce(
      (acc, col) => ({ ...acc, [col.id]: col.width || 150 }),
      {}
    )
  );

  // Resize state
  const [resizing, setResizing] = useState<string | null>(null);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  // Update widths when columns change
  useEffect(() => {
    setColumnWidths((prev) => {
      const newWidths = { ...prev };
      columns.forEach((col) => {
        if (!(col.id in newWidths)) {
          newWidths[col.id] = col.width || 150;
        }
      });
      return newWidths;
    });
  }, [columns]);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setResizing(columnId);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = columnWidths[columnId] || 150;
    },
    [columnWidths]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;
      const delta = e.clientX - resizeStartX.current;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, resizeStartWidth.current + delta);
      setColumnWidths((prev) => ({ ...prev, [resizing]: newWidth }));
    },
    [resizing]
  );

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  // Attach global mouse events during resize
  useEffect(() => {
    if (resizing) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (column.accessorFn) {
      return column.accessorFn(row);
    }
    if (column.accessorKey) {
      return String(row[column.accessorKey] ?? "");
    }
    return "";
  };

  const handleRowClick = (row: T) => {
    if (onRowSelect) {
      onRowSelect(row);
    }
  };

  const isSelected = (row: T) => {
    if (!selectedRow) return false;
    return row[keyField] === selectedRow[keyField];
  };

  const getColumnWidth = (columnId: string) => columnWidths[columnId] || 150;

  const handleSort = (columnId: string) => {
    if (!onSort) return;

    if (!sort || sort.columnId !== columnId) {
      // New column or no current sort - start with ascending
      onSort({ columnId, direction: "asc" });
    } else if (sort.direction === "asc") {
      // Currently ascending - switch to descending
      onSort({ columnId, direction: "desc" });
    } else {
      // Currently descending - clear sort
      onSort(null);
    }
  };

  const getSortIcon = (columnId: string) => {
    if (!sort || sort.columnId !== columnId) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    if (sort.direction === "asc") {
      return <ArrowUp className="h-3 w-3" />;
    }
    return <ArrowDown className="h-3 w-3" />;
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-md overflow-hidden bg-card">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="min-w-max">
          {/* Header */}
          <div className="flex bg-muted border-b border-border sticky top-0 z-10">
            {columns.map((column) => (
              <div
                key={column.id}
                className={cn(
                  "relative px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                  "border-r border-border",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.sortable && "cursor-pointer hover:bg-muted-foreground/10 select-none"
                )}
                style={{
                  width: getColumnWidth(column.id),
                  minWidth: MIN_COLUMN_WIDTH,
                }}
                onClick={column.sortable ? () => handleSort(column.id) : undefined}
              >
                <div className={cn(
                  "flex items-center gap-1",
                  column.align === "center" && "justify-center",
                  column.align === "right" && "justify-end"
                )}>
                  <span className="truncate">{column.header}</span>
                  {column.sortable && getSortIcon(column.id)}
                </div>
                {/* Resize handle */}
                <div
                  className={cn(
                    "absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 transition-colors",
                    resizing === column.id && "bg-primary"
                  )}
                  onMouseDown={(e) => handleResizeStart(e, column.id)}
                />
              </div>
            ))}
            {/* Actions header - sticky to right */}
            {actions && (
              <div
                className="px-3 py-2 text-xs bg-muted sticky right-0 border-l border-border shadow-[-2px_0_4px_rgba(0,0,0,0.1)]"
                style={{ width: 80, minWidth: 80 }}
              >
                &nbsp;
              </div>
            )}
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              {t("loading")}
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              {t("noData")}
            </div>
          ) : (
            data.map((row) => (
              <div
                key={String(row[keyField])}
                className={cn(
                  "flex border-b border-border cursor-pointer transition-colors",
                  "hover:bg-accent/50",
                  isSelected(row) && "bg-accent"
                )}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={cn(
                      "px-3 py-1.5 text-sm truncate border-r border-border",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                    style={{
                      width: getColumnWidth(column.id),
                      minWidth: MIN_COLUMN_WIDTH,
                      height: 32,
                      lineHeight: "20px",
                    }}
                  >
                    {getCellValue(row, column)}
                  </div>
                ))}
                {/* Actions cell - sticky to right */}
                {actions && (
                  <div
                    className={cn(
                      "px-2 flex items-center justify-center sticky right-0 border-l border-border shadow-[-2px_0_4px_rgba(0,0,0,0.1)]",
                      isSelected(row) ? "bg-accent" : "bg-card"
                    )}
                    style={{ width: 80, minWidth: 80, height: 32 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toolbar */}
      <DataGridToolbar
        pagination={pagination}
        onPageChange={onPageChange}
        onFilter={onFilter}
        onEditFilters={onEditFilters}
        onDownload={onDownload}
        onReload={onReload}
      />
    </div>
  );
}