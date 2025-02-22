import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user || null);
        storeUserInLocalStorage(session.user);
      }
    });

    return () => {
      setLoading(false);
    };
  }, []);

  const storeUserInLocalStorage = (user: any) => {
    try {
      localStorage.setItem(
        'users',
        JSON.stringify([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
          },
        ]),
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error storing user in database:', error.message);
      } else {
        console.error('Error storing user in database:', error);
      }
    }
  };

  const signInWithGoogle = async () => {
    console.log("signing in with google", import.meta.env.VITE_SUPABASE_REDIRECT_URI);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URI,
      },
    });
    if (error) console.error('Error logging in:', error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('users');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};