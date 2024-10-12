
"use client";

import { Carousel } from "flowbite-react";
import Image from "next/image";

export default function HomePageCarousel() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 max-w-7xl m-auto">
      <Carousel slideInterval={5000}>
        <Image width={1280} height={784} style={{width:"100%"}} src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1728659797/alumni-cell-gbpuat/cbixpy64i9aepmjyjanc.jpg`} alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1728659795/alumni-cell-gbpuat/bd1fgdp5p9yhhzkef9nz.jpg`} alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1728659795/alumni-cell-gbpuat/g4u2jwfdwebipxots3tt.jpg`} alt="..." />
        <Image width={1280} height={784} style={{width:"100%"}} src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1728659795/alumni-cell-gbpuat/gsmff33tvu4eosi8hws2.jpg`} alt="..." />
      </Carousel>
    </div>
  );
}
