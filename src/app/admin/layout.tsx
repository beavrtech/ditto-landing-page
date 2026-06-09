"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABLES = [
  { name: "Blog Posts", href: "/admin/blog-posts" },
  { name: "News", href: "/admin/news" },
  { name: "Guides", href: "/admin/guides" },
  { name: "Customer Stories", href: "/admin/customer-stories" },
  { name: "Collection Items", href: "/admin/collection-items" },
  { name: "Events", href: "/admin/events" },
  { name: "Authors", href: "/admin/authors" },
  { name: "Testimonials", href: "/admin/testimonials" },
  { name: "Frameworks", href: "/admin/frameworks" },
  { name: "Industries", href: "/admin/industries" },
  { name: "Company Logos", href: "/admin/company-logos" },
];

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "1") setAuthed(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/admin/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin_authed", "1");
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui, sans-serif", background: "#f5f5f5" }}>
        <form onSubmit={handleSubmit} style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", width: "320px" }}>
          <h1 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: 600 }}>Admin Access</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem", boxSizing: "border-box" }}
          />
          {error && <p style={{ color: "red", fontSize: "0.875rem", margin: "0.5rem 0 0" }}>Invalid password</p>}
          <button type="submit" style={{ width: "100%", marginTop: "1rem", padding: "0.75rem", background: "#130E30", color: "white", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer" }}>
            Log in
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <PasswordGate>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
        {/* Sidebar */}
        <nav style={{ width: "240px", background: "#130E30", color: "white", padding: "1.5rem 0", flexShrink: 0 }}>
          <div style={{ padding: "0 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <Link href="/admin" style={{ color: "white", textDecoration: "none", fontSize: "1.25rem", fontWeight: 700 }}>
              Ditto Admin
            </Link>
          </div>
          <div style={{ padding: "1rem 0" }}>
            {TABLES.map((table) => {
              const isActive = pathname.startsWith(table.href);
              return (
                <Link
                  key={table.href}
                  href={table.href}
                  style={{
                    display: "block",
                    padding: "0.5rem 1.5rem",
                    color: isActive ? "white" : "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    borderLeft: isActive ? "3px solid white" : "3px solid transparent",
                  }}
                >
                  {table.name}
                </Link>
              );
            })}
          </div>
        </nav>
        {/* Main content */}
        <main style={{ flex: 1, background: "#f9fafb", padding: "2rem", overflow: "auto" }}>
          {children}
        </main>
      </div>
    </PasswordGate>
  );
}
