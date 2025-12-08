import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/libs/createClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const { data: { session }, } = await supabase.auth.getSession();
                // console.log('session', session.user.user_metadata);
                setUser(session?.user ?? null);
            } catch (error) {
                console.error('Error fetching user:', error.message);

            }
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event,
            session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };

    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    )};

export const useAuth = () => useContext(AuthContext);