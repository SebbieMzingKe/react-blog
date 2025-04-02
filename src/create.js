import { useState, useContext } from "react";
import AuthContext from "./AuthContext";

const Create = ({ addNewBlog }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [author, setAuthor] = useState('sebbie');
    const [isPending, setIsPending] = useState(false);
    const { user } = useContext(AuthContext); // Get token from AuthContext

    console.log("Auth Token", user);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, author };

        setIsPending(true);

        fetch('http://localhost:8000/blogs', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user}`
            },
            body: JSON.stringify(blog)
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

                <label>Blog author:</label>
                <select value={author} onChange={(e) => setAuthor(e.target.value)}>
                    <option value="sebbie">Sebbie</option>
                    <option value="mzing">Mzing</option>
                </select>

                {!isPending && <button>Add blog</button>}
                {isPending && <button disabled>Adding blog...</button>}
            </form>
        </div>
    );
};

export default Create;
