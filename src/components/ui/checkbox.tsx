import * as React from "react"

import { cn } from "@/lib/utils"

interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
}

function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const inputId = id || React.useId();

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={inputId}
        data-slot="checkbox"
        className={cn(
          "h-4 w-4 rounded border border-input bg-transparent text-primary shadow-xs transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "checked:bg-primary checked:border-primary",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
    </div>
  )
}

export { Checkbox }