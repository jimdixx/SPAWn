import React, { createContext, useState, useEffect } from 'react';
interface AuthContextType {
    token: string;
    setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: '',
    setToken: () => {},
});

const TOKEN_KEY = 'definetly_not_token';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

    useEffect(() => {
        localStorage.setItem(TOKEN_KEY, token);
    }, [token]);

    return ( //vykresli modalni okno if user is not logged in else nevykresli nic
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;