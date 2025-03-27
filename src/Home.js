import React, { useState } from "react";
import BlogList from "./BlogList";
import useFetch from "./useFetch";
import Create from "./Create";

const Home = () => {
    // const { data: blogs, isPending, error } = useFetch('https://chanzublog.onrender.com/blogs');
    const { data, isPending, error } = useFetch('https://chanzublog.onrender.com/blogs');
    const [showCreate, setShowCreate] = useState(false); // Controls popover visibility
    const [localBlogs, setLocalBlogs] = useState([]); // Local blog state

    console.log(data,error)

    // Add new blog to local state without refreshing
    const addNewBlog = (newBlog) => {
        setLocalBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
        setShowCreate(false); // Close popover after submission
    };

    return (
        <div className="Home">
            <button onClick={() => setShowCreate(true)}>+ Add Blog</button> {/* Open popover */}
            
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
            {data && <BlogList blogs={[...data, ...localBlogs]} title="All Blogs." />} {/* Merge state & API data */}
        </div>
    );
};

export default Home;