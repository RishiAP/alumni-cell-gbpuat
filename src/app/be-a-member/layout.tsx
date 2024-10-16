import type { Metadata } from "next";
import ReduxProvider from "@/components/ReduxProvider";

export const metadata: Metadata = {
  title: "Be a member | Alumni Cell",
  description: "Be a member of the alumni cell pantnagar for better connection.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
        {children}
    </ReduxProvider>
  );
}

