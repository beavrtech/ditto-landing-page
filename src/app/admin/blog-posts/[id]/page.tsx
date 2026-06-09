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
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPost(data);
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!post) return <p>Loading...</p>;

  return <BlogPostForm post={post} />;
}
