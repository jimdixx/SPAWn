import React, { createContext, useState } from 'react';

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }} >
            {/*https://www.youtube.com/watch?v=X3qyxo_UTR4&ab_channel=DaveGray 16:20*/}
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;