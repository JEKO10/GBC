"use client";

import Image from "next/image";
import Link from "next/link";

const images: string[] = [
  "/scrolling/approved.png",
  "/scrolling/hot.png",
  "/scrolling/naan-hori.png",
  "/scrolling/naan-vert.png",
  "/scrolling/man.png",
  "/scrolling/woman.png",
  "/scrolling/unc.png",
  "/scrolling/all.png",
];

// @TODO mozda manje slike na manje ekrane
export default function LogosSlider() {
  return (
    <article className="mt-10 w-full relative overflow-hidden py-5 bg-secondary">
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-secondary to-transparent z-10" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-secondary to-transparent z-10" />
      <Link href="/map" className="logos-slide flex w-max animate-slide">
        {images.concat(images).map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`image-${index}`}
            width={148}
            height={120}
            className="mx-10 h-[200px] w-auto rounded-md"
          />
        ))}
      </Link>
    </article>
  );
}
