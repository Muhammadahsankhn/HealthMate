import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B9FF66]/40 focus-visible:outline-none",
  {
    variants: {
      variant: {
        // 💚 Modern, smooth hover
        default:
          "bg-[#B9FF66] text-black hover:bg-[#A5E65C] active:bg-[#9CDD52] shadow-sm hover:shadow-md",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/40",
        outline:
          "border border-gray-600 text-white hover:bg-gray-800 active:bg-gray-700",
        secondary:
          "bg-gray-800 text-gray-100 hover:bg-gray-700 active:bg-gray-600",
        ghost:
          "text-gray-300 hover:bg-gray-800 hover:text-white active:bg-gray-700",
        link: "text-[#B9FF66] underline-offset-4 hover:underline hover:text-[#A5E65C]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
