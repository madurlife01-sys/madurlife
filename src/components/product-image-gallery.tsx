"use client";

import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  name: string;
}

export function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-white dark:bg-zinc-900 shadow-sm">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="text-center">
            <img
              src="/brand/icon.jpeg"
              alt="Madur Life"
              className="w-24 h-24 mx-auto rounded-2xl object-cover mb-4 opacity-40"
            />
            <span className="text-lg font-medium text-muted">{name}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-24">
      <div className="aspect-square rounded-3xl overflow-hidden border border-border bg-white dark:bg-zinc-900 shadow-sm">
        <img
          src={images[selectedIndex]}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((img: string, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                selectedIndex === i
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
