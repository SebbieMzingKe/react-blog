'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Blog } from "@/types/blog";

interface CreateBlogProps {
  addNewBlog: (blog: Blog) => void;
}

const CreateBlog = ({ addNewBlog }: CreateBlogProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const blog = { title, body, author: user.email };

    setIsPending(true);

    fetch("https://chanzublog.onrender.com/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
      body: JSON.stringify(blog),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((newBlog: Blog) => {
        setIsPending(false);
        addNewBlog(newBlog);
        setTitle("");
        setBody("");
      })
      .catch((err) => {
        console.error("Error adding blog:", err);
        setIsPending(false);
      });
  };

  return (
    <div className="create">
      <h2>Add a new blog</h2>
      <form onSubmit={handleSubmit}>
        <label>Blog title:</label>
        <input 
          type="text" 
          required 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <label>Blog body:</label>
        <textarea 
          required 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
        />
        {!isPending && <button>Add blog</button>}
        {isPending && <button disabled>Adding blog...</button>}
      </form>
    </div>
  );
};

export default CreateBlog;