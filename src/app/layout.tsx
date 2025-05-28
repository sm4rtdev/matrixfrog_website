// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import WalletProvider from "../app/providers/WalletProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "MatrixFrog",
  description:
    "A choice between two worlds. Human or Frog? Reality or Simulation?",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <WalletProvider>
          {children}
          <ToastContainer />
        </WalletProvider>
      </body>
    </html>
  );
}
