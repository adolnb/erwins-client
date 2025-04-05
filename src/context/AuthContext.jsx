import { createContext, useState, useEffect, useContext } from 'react';
import { logoutRequest, verifyTokenRequest } from '../api/auth';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (userData) => {
        try {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            logout();
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
        }
    };
    
    useEffect(() => {
        const verifyAuth = async () => {
            if (user) {
                try {
                    await verifyTokenRequest();
                    setIsAuthenticated(true);
                } catch (error) {
                    logout();
                }
            }
        };
        
        const interval = setInterval(verifyAuth, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};