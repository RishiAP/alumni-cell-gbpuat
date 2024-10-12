import ReduxProvider from "@/components/ReduxProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"Profile Page | Alumni Cell",
    description:"Profile page for your account",
}

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
