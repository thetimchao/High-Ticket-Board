import "./globals.css";

export const metadata = {
  title: "HighTicket Board — Setter & Closer Jobs",
  description:
    "The job board for high-ticket remote sales: DM setting, phone setting, and closing offers with real OTEs, commission structures, and niches.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
