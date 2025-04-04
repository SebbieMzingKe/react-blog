import React, { useState } from "react";
import BlogList from "./BlogList";
import useFetch from "./useFetch";
import Create from "./Create";

const Home = ({ localBlogs, addNewBlog }) => {
    const { data, isPending, error } = useFetch("https://chanzublog.onrender.com/blogs");
    const [showCreate, setShowCreate] = useState(false);

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
            {data && <BlogList blogs={[...data, ...localBlogs]} title="Your Blogs" />}
        </div>
    );
};

export default Home;