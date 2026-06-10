import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 – Page not found | Ditto",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#130e30",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: "0 0 0.5rem" }}>404</h1>
        <p style={{ margin: "0 0 1.5rem", color: "#555" }}>
          This page could not be found.
        </p>
        <Link href="/en" style={{ color: "#130e30", fontWeight: 600 }}>
          Back to homepage
        </Link>
      </body>
    </html>
  );
}
