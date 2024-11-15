import type { Metadata } from "next";
import "./globals.css";
import { ClientWrapper } from "./components/ClientWrapper";
import Header from "./components/Header";
import Provider from "./Provider";

export const metadata: Metadata = {
  title: "Create Nillion App",
  description: "Quickstart a Nillion fullstack app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <ClientWrapper>
            <Header />
            {children}
          </ClientWrapper>
        </Provider>
      </body>
    </html>
  );
}
