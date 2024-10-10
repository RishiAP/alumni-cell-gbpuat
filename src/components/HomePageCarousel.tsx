
"use client";

import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function HomePageCarousel() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 max-w-7xl m-auto">
      <Carousel slideInterval={5000}>
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728536795/q62iuicnjzxlvkysldxa.jpg" alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728537925/rfjd8dqlj7miytebyvwl.jpg" alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728538383/zjyoia6wmebknkscwelt.jpg" alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728538557/veoysddckoaikjgrqqj1.jpg" alt="..." />
      </Carousel>
    </div>
  );
}
