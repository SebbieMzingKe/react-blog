'use client';

import PrivateRoute from "@/components/PrivateRoute";
import CreateBlog from "@/components/CreateBlog";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blog";

export default function Create() {
  const router = useRouter();

  const addNewBlog = (newBlog: Blog) => {
    // Redirect to home after creating blog
    router.push("/");
  };

  return (
    <PrivateRoute>
      <CreateBlog addNewBlog={addNewBlog} />
    </PrivateRoute>
  );
}