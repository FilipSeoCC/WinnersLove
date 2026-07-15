import "./globals.css";

export const metadata = {
  title: "Jamnikowa randka",
  description: "Romantyczna kartka z uroczym jamnikiem i wyborem daty randki."
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffe1eb"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
