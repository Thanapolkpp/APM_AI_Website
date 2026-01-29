import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem("token");
                const savedUser = localStorage.getItem("user");

                if (token && savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.error("Failed to parse user data", err);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);