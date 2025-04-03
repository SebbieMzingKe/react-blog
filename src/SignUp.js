import { useState } from "react";
import { useHistory } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const response = await fetch("https://chanzublog.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Account created successfully! Please log in.");
            history.push("/login");
        } else {
            setError(data.message || "Signup failed!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />

                <label>Email:</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Password:</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Confirm Password:</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    );
};

export default Signup;
