"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogPostForm } from "../../../../components/admin/BlogPostForm";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/admin/api/blog-posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Not found (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data.error) setError(data.error);
        else setPost(data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return (
    <div>
      <p style={{ color: "#dc2626", marginBottom: "1rem" }}>Post not found</p>
      <a href="/admin/blog-posts" style={{ color: "#130E30" }}>&larr; Back to list</a>
    </div>
  );
  if (!post) return <p>Loading...</p>;

  return <BlogPostForm post={post} />;
}
