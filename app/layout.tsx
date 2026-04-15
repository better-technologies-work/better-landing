import "./globals.css";

export const metadata = {
  title: "Better Technologies",
  description: "We operate LATAM for Global companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}