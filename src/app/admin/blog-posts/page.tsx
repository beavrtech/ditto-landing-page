"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BlogPost = {
  id: string;
  name_en: string;
  slug: string;
  date_de_publication: string | null;
  published: boolean;
};

export default function BlogPostsListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch("/admin/api/blog-posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/admin/api/blog-posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>Blog Posts ({posts.length})</h1>
        <Link
          href="/admin/blog-posts/new"
          style={{
            padding: "0.5rem 1rem",
            background: "#130E30",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          + New Post
        </Link>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #eee" }}>
            <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Title</th>
            <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Slug</th>
            <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Date</th>
            <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Status</th>
            <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                <Link href={`/admin/blog-posts/${post.id}`} style={{ color: "#130E30", textDecoration: "none", fontWeight: 500 }}>
                  {post.name_en || "(untitled)"}
                </Link>
              </td>
              <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#666", fontFamily: "monospace" }}>{post.slug}</td>
              <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#666" }}>
                {post.date_de_publication ? new Date(post.date_de_publication).toLocaleDateString("fr-FR") : "—"}
              </td>
              <td style={{ padding: "0.75rem 1rem" }}>
                <span style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  background: post.published ? "#dcfce7" : "#fef3c7",
                  color: post.published ? "#166534" : "#92400e",
                }}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </td>
              <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                <button
                  onClick={() => handleDelete(post.id, post.name_en)}
                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
