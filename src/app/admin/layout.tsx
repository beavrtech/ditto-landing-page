import type { Metadata } from "next";
import AdminShell from "./AdminShell";
import "../globals.css";

export const metadata: Metadata = {
  title: "Ditto Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
