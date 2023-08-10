"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { User } from '@/types';

type AuthContextType = {
    loading: boolean;
    user: User | null;
    token: string | null;
    get: <T>(query: string) => Promise<T>;
    post: <T>(query: string, body?: Object) => Promise<T>;
    patch: <T>(query: string, body?: Object) => Promise<T>;
}
const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if(!context) throw new Error('Content is not wrapped in auth provider.');

    return context;
}

export const AuthProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [token, setToken] = useState<null | string>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = window.localStorage.getItem('accessToken');
        setToken(token);
    }, []);

    useEffect(() => {
        if(!token) return setLoading(false);

        get<User>(`/users/me`)
            .then(setUser)
            .finally(() => {
                setLoading(false);
            })
    }, [token]);

    const get: AuthContextType['get'] = useCallback(async (query) => (
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}${query}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return await res.json();
        })
        .then(res => res)
    ), [token]);

    const post: AuthContextType['post'] = useCallback(async (query, body={}) => (
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}${query}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return await res.json();
        })
        .then(res => res)
    ), [token]);

    const patch: AuthContextType['patch'] = useCallback(async (query, body={}) => (
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN}${query}`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(async res => {
            if(!res.ok) throw new Error((await res.json()).message);
            return await res.json();
        })
        .then(res => res)
    ), [token]);

    const value = {
        user,
        get,
        post,
        patch,
        loading,
        token,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}