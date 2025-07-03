'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Blog } from "@/types/blog";

interface BlogListProps {
  blogs: Blog[];
  title: string;
}

const BlogList = ({ blogs, title }: BlogListProps) => {
  const { user } = useAuth();

  const userBlogs = blogs.filter((blog) => blog.author === user?.email);

  if (!userBlogs || userBlogs.length === 0) {
    return <p>No blogs found for you</p>;
  }

  return (
    <div className="blog-list">
      <h2>{title}</h2>
      {userBlogs.map((blog) => (
        <div className="blog-previews" key={blog.id}>
          <Link href={`/blogs/${blog.id}`}>
            <h2>{blog.title}</h2>
            <p>Written by {blog.author}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;