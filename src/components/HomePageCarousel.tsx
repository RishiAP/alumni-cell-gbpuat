
"use client";

import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function HomePageCarousel() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 max-w-7xl m-auto">
      <Carousel slideInterval={5000}>
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728547825/alumni-cell-gbpuat/fafqb2evqbubdqlc5zfj.jpg" alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728547825/alumni-cell-gbpuat/zit4pe6ta0auuyxuirh4.jpg" alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728548524/alumni-cell-gbpuat/clgthb3o5sgijctqjz8e.jpg" alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src="https://res.cloudinary.com/dnxfq38fr/image/upload/v1728547825/alumni-cell-gbpuat/tmbpktcsz2gl8kkxzgrb.jpg" alt="..." />
      </Carousel>
    </div>
  );
}
