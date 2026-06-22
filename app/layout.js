import "./globals.css";

export const metadata = {
  title: "Jamnikowa randka",
  description: "Romantyczna kartka z uroczym jamnikiem i wyborem daty randki."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
