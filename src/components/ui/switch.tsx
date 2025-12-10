"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch@1.1.3";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border-2 transition-all outline-none focus-visible:ring-[3px]",
        "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[var(--primary)] data-[state=checked]:border-[var(--primary)]",
        "data-[state=unchecked]:bg-[var(--switch-background)] data-[state=unchecked]:border-[var(--border)]",
        "focus-visible:border-[var(--ring)] focus-visible:ring-[var(--ring)]/50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          "bg-[var(--card)]",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
