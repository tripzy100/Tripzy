"use client";

import * as React from "react";
import Image from "next/image";
import { Car } from "lucide-react";
import { cn } from "@/utils/cn";

interface CarImageProps {
  src: string;
  alt: string;
  aspectRatio?: "video" | "square" | "auto";
  objectFit?: "cover" | "contain";
  className?: string;
  priority?: boolean;
}

export function CarImage({
  src,
  alt,
  aspectRatio = "video",
  objectFit = "cover",
  className,
  priority = false,
}: CarImageProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-[16/10]"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-auto";

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-lg border border-border bg-muted/40 p-6 text-muted-foreground",
          aspectClass,
          className
        )}
      >
        <Car className="h-12 w-12 stroke-[1.25] opacity-40" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/20 w-full", aspectClass, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-all duration-300 group-hover:scale-105",
          objectFit === "contain" ? "object-contain p-2" : "object-cover",
          isLoading ? "opacity-0 blur-sm" : "opacity-100 blur-0"
        )}
      />
    </div>
  );
}
