import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // user will now hold { token, email }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            
            fetch("https://chanzublog.onrender.com/user", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setUser({ token, email: data.email });
                })
                .catch((err) => console.error("Error fetching user:", err));
        }
    }, []);

    const login = (token, email) => {
        localStorage.setItem("token", token);
        setUser({ token, email });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;