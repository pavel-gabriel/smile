import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smile",
  description: "One phrase a day to make you smile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
