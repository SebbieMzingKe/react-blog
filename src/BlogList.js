import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const BlogList = ({ blogs, title }) => {
    const { user } = useContext(AuthContext);

    // Filter blogs by the current user's email
    const userBlogs = blogs.filter((blog) => blog.author === user?.email);

    if (!userBlogs || userBlogs.length === 0) {
        return <p>No blogs found for you</p>;
    }

    return (
        <div className="blog-list">
            <h2>{title}</h2>
            {userBlogs.map((blog) => (
                <div className="blog-previews" key={blog.id}>
                    <Link to={`/blogs/${blog.id}`}>
                        <h2>{blog.title}</h2>
                        <p>Written by {blog.author}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default BlogList;