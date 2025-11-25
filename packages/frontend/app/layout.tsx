// packages/frontend/app/layout.tsx
import "./../styles/globals.css";
import { ThemeProvider } from "../lib/theme";
import NavBar from "../components/NavBar";
// import { Montserrat } from "next/font/google";

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
//   display: "swap",
// });

export const metadata = {
  title: "Real Estate CRM",
  description: "AI-powered CRM for real-estate developers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-bg text-(--color-text)">
            <NavBar />
            <main className='max-w-6xl mx-auto p-6'>{children}</main>
            <footer className="border-t mt-8 py-6 text-center text-sm text-muted-500">
              © {new Date().getFullYear()} Real Estate CRM
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
