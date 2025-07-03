'use client';

import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import PrivateRoute from "@/components/PrivateRoute";
import { Blog } from "@/types/blog";

interface BlogDetailsProps {
  params: {
    id: string;
  };
}

export default function BlogDetails({ params }: BlogDetailsProps) {
  const { data, error, isPending } = useFetch<Blog>(`https://chanzublog.onrender.com/blogs/${params.id}`);
  const router = useRouter();

  const handleClick = () => {
    fetch(`https://chanzublog.onrender.com/blogs/${params.id}`, {
      method: 'DELETE'
    }).then(() => {
      router.push('/');
    });
  };

  return (
    <PrivateRoute>
      <div className="blog-details">
        {isPending && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {data && (
          <article>
            <h2>{data.title}</h2>
            <p>Written by {data.author}</p>
            <div>{data.body}</div>
            <button onClick={handleClick}>Delete</button>
          </article>
        )}
      </div>
    </PrivateRoute>
  );
}