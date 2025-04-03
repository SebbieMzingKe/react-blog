import React, { useContext, useState } from "react";
import BlogList from "./BlogList";
import useFetch from "./useFetch";
import Create from "./Create";
import AuthContext from "./AuthContext";

const Home = ({ localBlogs, addNewBlog }) => {
  const { user } = useContext(AuthContext);
  const { data, isPending, error } = useFetch('https://chanzublog.onrender.com/blogs');
  const [showCreate, setShowCreate] = useState(false);

  const userBlogs = data?.filter(blog => blog.author === user?.email) || [];

  if (userBlogs.length === 0 && localBlogs.length === 0) {
    return <p>No blogs found for you.</p>;
  }

  return (
    <div className="Home">
      <button onClick={() => setShowCreate(true)}>+ Add Blog</button>

      {showCreate && (
        <div className="overlay">
          <div className="popover">
            <button className="close-btn" onClick={() => setShowCreate(false)}>X</button>
            <Create addNewBlog={addNewBlog} />
          </div>
        </div>
      )}

      {error && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {(userBlogs.length > 0 || localBlogs.length > 0) && (
        <BlogList blogs={[...userBlogs, ...localBlogs]} title="Your Blogs" />
      )}
    </div>
  );
};

export default Home;