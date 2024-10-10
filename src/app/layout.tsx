import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alumni Cell Pantnagar",
  description: "Connecting Alumni and Students",
  robots: "index, follow", // For search engine indexing and crawling
  openGraph: {
    title: "Alumni Cell Pantnagar",
    description: "Connecting Alumni and Students",
    url: "https://alumni-cell-gbpuat.vercel.app", // Replace with your domain
    type: "website",
    siteName: "Alumni Cell Pantnagar",
    images: [
      {
        url: "https://res.cloudinary.com/dnxfq38fr/image/upload/v1728536795/q62iuicnjzxlvkysldxa.jpg", // Path to the OG image
        width: 800,
        height: 600,
        alt: "Alumni Cell Pantnagar OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // Type of Twitter card
    site: "@alumnicell", // Your Twitter handle (optional)
    creator: "@alumnicell", // Content creator's Twitter handle
    title: "Alumni Cell Pantnagar",
    description: "Connecting Alumni and Students",
    images: ["https://res.cloudinary.com/dnxfq38fr/image/upload/v1728536795/q62iuicnjzxlvkysldxa.jpg"], // Path to Twitter card image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
