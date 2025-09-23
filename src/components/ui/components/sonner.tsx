import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { toastVariants } from "../variants/sonner-variants";

export function Toaster() {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      toastOptions={toastVariants}
    />
  );
}
