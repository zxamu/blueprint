import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Galería de Planos",
  description: "Visor de planos en PDF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex bg-gray-100`}>
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}