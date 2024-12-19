import { Link } from "react-router-dom/cjs/react-router-dom.min";
const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>Sebastian Chanzu Blog</h1>
            <div className="links"></div>
            <Link to="/">Home</Link>
            <Link to="/create">New Blog</Link>
        </nav>
     );
}
 
export default Navbar;