'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Blog } from "@/types/blog";
import { Calendar, User, Hash, Clock } from "lucide-react";

interface BlogListProps {
  blogs: Blog[];
  title: string;
}

const BlogList = ({ blogs, title }: BlogListProps) => {
  const { user } = useAuth();

  const userBlogs = blogs.filter((blog) => blog.author === user?.email);

  if (!userBlogs || userBlogs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-content">
          <h3>No blogs found</h3>
          <p>You haven't created any blog posts yet. Start writing your first blog!</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="blog-list">
      <h2 className="blog-list-title">{title}</h2>
      <div className="blog-grid">
        {userBlogs.map((blog) => (
          <article className="blog-card" key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    <Calendar size={14} />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="reading-time">
                    <Clock size={14} />
                    {calculateReadingTime(blog.body)} min read
                  </span>
                </div>
                
                <h3 className="blog-title">{blog.title}</h3>
                
                {blog.excerpt && (
                  <p className="blog-excerpt">{blog.excerpt}</p>
                )}
                
                <div className="blog-footer">
                  <div className="blog-author">
                    <User size={14} />
                    <span>{blog.author}</span>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="blog-tag">
                          <Hash size={12} />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="more-tags">+{blog.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogList;