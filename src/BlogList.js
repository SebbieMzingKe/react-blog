import { Link } from "react-router-dom/cjs/react-router-dom.min";
import AuthContext from "./AuthContext";
import { useContext } from "react";

const BlogList = ({blogs, title}) => {
    // const blogs = props.blogs
    // const title = props.title

    const { user } = useContext(AuthContext);

    const userBlogs = blogs?.filter(blog => blogs.author === user?.email)

    if(!userBlogs || userBlogs.length === 0){
        return <p>No blogs found for you </p>
    }

    return ( 
        <div className="blog-list">
            <h2>{title}</h2>
        
            {blogs?.map((blog) => (
                <div className="blog-previews" key = {blog?.id}>
                    <Link to = {`/blogs/${blog?.id}`}>
                    <h2>{blog.title}</h2>
                    <p>written by {blog?.author}</p>
                    </Link>
                    
                    
                </div>
            ))}
        </div>
     );
}
 
export default BlogList;