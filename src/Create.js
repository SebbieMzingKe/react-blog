import { useState, useContext } from "react";
import AuthContext from "./AuthContext";

const Create = ({ addNewBlog }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isPending, setIsPending] = useState(false);
    const { user } = useContext(AuthContext); // Get user object with token and email

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, author: user.email }; // Use user's email as author

        setIsPending(true);

        fetch("https://chanzublog.onrender.com/blogs", { // Update URL to match your backend
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify(blog),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((newBlog) => {
                setIsPending(false);
                addNewBlog(newBlog); // Add new blog to state
                setTitle("");
                setBody("");
            })
            .catch((err) => {
                console.error("Error adding blog:", err);
                setIsPending(false);
            });
    };

    return (
        <div className="create">
            <h2>Add a new blog</h2>
            <form onSubmit={handleSubmit}>
                <label>Blog title:</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <label>Blog body:</label>
                <textarea required value={body} onChange={(e) => setBody(e.target.value)} />
                {!isPending && <button>Add blog</button>}
                {isPending && <button disabled>Adding blog...</button>}
            </form>
        </div>
    );
};

export default Create;