'use client';

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Blog, BlogFormData } from "@/types/blog";
import { Save, Eye, EyeOff, Hash, FileText, Type, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface CreateBlogProps {
  addNewBlog: (blog: Blog) => void;
  onClose?: () => void;
}

const CreateBlog = ({ addNewBlog, onClose }: CreateBlogProps) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    body: "",
    tags: [],
    excerpt: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<BlogFormData>>({});
  const [isDraft, setIsDraft] = useState(false);
  const { user } = useAuth();

  // Auto-save draft functionality
  useEffect(() => {
    const draftKey = `blog-draft-${user?.email}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setFormData(draft);
        setIsDraft(true);
        toast.success("Draft restored!");
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, [user?.email]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!user?.email) return;
    
    const interval = setInterval(() => {
      if (formData.title || formData.body) {
        const draftKey = `blog-draft-${user.email}`;
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setIsDraft(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, user?.email]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<BlogFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Content is required";
    } else if (formData.body.length < 10) {
      newErrors.body = "Content must be at least 10 characters";
    }

    if (formData.excerpt && formData.excerpt.length > 200) {
      newErrors.excerpt = "Excerpt must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const generateExcerpt = () => {
    const plainText = formData.body.replace(/[#*`\[\]]/g, '').trim();
    const excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    setFormData(prev => ({ ...prev, excerpt }));
    toast.success("Excerpt generated!");
  };

  const saveDraft = () => {
    if (!user?.email) return;
    const draftKey = `blog-draft-${user.email}`;
    localStorage.setItem(draftKey, JSON.stringify(formData));
    setIsDraft(true);
    toast.success("Draft saved!");
  };

  const clearDraft = () => {
    if (!user?.email) return;
    const draftKey = `blog-draft-${user.email}`;
    localStorage.removeItem(draftKey);
    setIsDraft(false);
    toast.success("Draft cleared!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validateForm()) return;

    const blog = { 
      title: formData.title.trim(),
      body: formData.body.trim(),
      author: user.email,
      tags: formData.tags,
      excerpt: formData.excerpt || formData.body.substring(0, 150) + '...'
    };

    setIsPending(true);

    try {
      const response = await fetch("https://chanzublog.onrender.com/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(blog),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newBlog: Blog = await response.json();
      addNewBlog(newBlog);
      
      // Clear draft after successful submission
      if (user.email) {
        const draftKey = `blog-draft-${user.email}`;
        localStorage.removeItem(draftKey);
      }
      
      setFormData({ title: "", body: "", tags: [], excerpt: "" });
      setIsDraft(false);
      toast.success("Blog published successfully!");
      onClose?.();
    } catch (err) {
      console.error("Error adding blog:", err);
      toast.error("Failed to publish blog. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const wordCount = formData.body.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="create-blog-enhanced">
      <div className="create-header">
        <div className="header-left">
          <FileText className="icon" />
          <h2>Create New Blog Post</h2>
        </div>
        <div className="header-actions">
          {isDraft && (
            <button type="button" onClick={clearDraft} className="btn-draft">
              Clear Draft
            </button>
          )}
          <button type="button" onClick={saveDraft} className="btn-save">
            <Save size={16} />
            Save Draft
          </button>
          <button 
            type="button" 
            onClick={() => setIsPreview(!isPreview)} 
            className="btn-preview"
          >
            {isPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {isDraft && (
        <div className="draft-notice">
          <AlertCircle size={16} />
          <span>You have a saved draft</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">
            <Type size={16} />
            Blog Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter an engaging title..."
            className={errors.title ? "error" : ""}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
          <div className="char-count">
            {formData.title.length}/100 characters
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            <Hash size={16} />
            Tags (Press Enter to add)
          </label>
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tags (max 5)..."
            disabled={formData.tags.length >= 5}
          />
          {formData.tags.length > 0 && (
            <div className="tags-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">
            Excerpt (Optional)
            <button type="button" onClick={generateExcerpt} className="btn-generate">
              Auto-generate
            </button>
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief description of your blog post..."
            rows={3}
            className={errors.excerpt ? "error" : ""}
          />
          {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
          <div className="char-count">
            {formData.excerpt.length}/200 characters
          </div>
        </div>

        <div className="form-group">
          <label>Content</label>
          {isPreview ? (
            <div className="preview-container">
              <MDEditor.Markdown source={formData.body} />
            </div>
          ) : (
            <MDEditor
              value={formData.body}
              onChange={(value) => setFormData(prev => ({ ...prev, body: value || "" }))}
              preview="edit"
              hideToolbar={false}
              height={400}
            />
          )}
          {errors.body && <span className="error-message">{errors.body}</span>}
          <div className="content-stats">
            <span>{wordCount} words</span>
            <span>~{readingTime} min read</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isPending} className="btn-publish">
            {isPending ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;