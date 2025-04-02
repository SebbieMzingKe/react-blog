import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <h1>Sebastian Chanzu Blog</h1>
            <div className="links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/create">New Blog</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
