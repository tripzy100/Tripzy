"use client";

import * as React from "react";

interface CarImageProps {
  src: string;
  alt: string;
}

export function CarImage({ src, alt }: CarImageProps) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}
