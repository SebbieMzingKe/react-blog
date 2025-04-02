import React, { useContext, useState } from "react";
import BlogList from "./BlogList";
import useFetch from "./useFetch";
import Create from "./Create";
import AuthContext from "./AuthContext";

const Home = () => {
    // const { data: blogs, isPending, error } = useFetch('https://chanzublog.onrender.com/blogs');
    const { user } = useContext(AuthContext)
    const { data, isPending, error } = useFetch('https://chanzublog.onrender.com/blogs');
    const [showCreate, setShowCreate] = useState(false); // Controls popover visibility
    const [localBlogs, setLocalBlogs] = useState([]); // Local blog state

    const userBlogs = data?.filter(blog => blog.author === user?.email) || [];

    if (!userBlogs || userBlogs.author === 0)
        return <p>No blogss found for you.</p>

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