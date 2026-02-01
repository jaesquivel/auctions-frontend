"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { DataGridToolbar } from "./DataGridToolbar";
import type { DataGridProps, ColumnDef } from "./types";

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
}: DataGridProps<T>) {
  const t = useTranslations("common");

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
                  "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate",
                  "border-r border-border",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                )}
                style={{
                  width: column.width || 150,
                  minWidth: column.width || 150,
                }}
              >
                {column.header}
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
                  isSelected(row) && "bg-accent",
                )}
                onClick={() => handleRowClick(row)}
              >
                {columns.map((column) => (
                  <div
                    key={column.id}
                    className={cn(
                      "px-3 py-1.5 text-sm truncate border-r border-border",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                    )}
                    style={{
                      width: column.width || 150,
                      minWidth: column.width || 150,
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
                      isSelected(row) ? "bg-accent" : "bg-card",
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
