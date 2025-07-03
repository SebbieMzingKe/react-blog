'use client';

import React, { useState } from "react";
import BlogList from "@/components/BlogList";
import CreateBlog from "@/components/CreateBlog";
import useFetch from "@/hooks/useFetch";
import { Blog } from "@/types/blog";

export default function Home() {
  const { data, isPending, error } = useFetch<Blog[]>("https://chanzublog.onrender.com/blogs");
  const [localBlogs, setLocalBlogs] = useState<Blog[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const addNewBlog = (newBlog: Blog) => {
    setLocalBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
  };

  return (
    <div className="Home">
      <button onClick={() => setShowCreate(true)}>+ Add Blog</button>

      {showCreate && (
        <div className="overlay">
          <div className="popover">
            <button className="close-btn" onClick={() => setShowCreate(false)}>X</button>
            <CreateBlog addNewBlog={addNewBlog} />
          </div>
        </div>
      )}

      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {data && <BlogList blogs={[...data, ...localBlogs]} title="Your Blogs" />}
    </div>
  );
}