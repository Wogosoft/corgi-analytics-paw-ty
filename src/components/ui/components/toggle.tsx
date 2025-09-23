import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toggleVariants } from "../variants/toggle-variants";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  ),
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle };
