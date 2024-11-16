import type { Metadata } from "next";
import "./globals.css";
import { ClientWrapper } from "./components/ClientWrapper";
import Provider from "./Provider";
import { SiteHeader } from "./components/site-header";
import { ThemeProvider } from "./components/theme-provider";

export const metadata: Metadata = {
  title: "Pvt Medical Research",
  description: "Pvt Medical Research with Signed Attestations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Provider>
            <ClientWrapper>
              <SiteHeader />
              {children}
            </ClientWrapper>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
