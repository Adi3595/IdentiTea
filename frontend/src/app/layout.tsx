import type { Metadata } from "next";
import { Inter, Black_Ops_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { JSONLD } from "@/components/json-ld";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const blackOpsOne = Black_Ops_One({
  weight: "400",
  variable: "--font-black-ops",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IdentiTea | Your Career. Brewed by AI.",
  description: "IdentiTea is an AI-powered Digital Identity and Career Intelligence Platform that transforms scattered files into an intelligent knowledge graph.",
  keywords: ["AI", "Career Intelligence", "Knowledge Graph", "Digital Identity", "Resume", "Portfolio"],
  authors: [{ name: "IdentiTea Team" }],
  openGraph: {
    title: "IdentiTea | Your Career. Brewed by AI.",
    description: "Transform scattered files into an intelligent knowledge graph.",
    url: "https://identitea.app",
    siteName: "IdentiTea",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdentiTea | Your Career. Brewed by AI.",
    description: "Transform scattered files into an intelligent knowledge graph.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${blackOpsOne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              {children}
              <JSONLD 
                data={{
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "IdentiTea",
                  "url": "https://identitea.app",
                  "description": "Your Career. Brewed by AI."
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
