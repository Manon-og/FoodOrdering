import {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react';
import { supabase } from '@/src/lib/supabase'
import { Session } from '@supabase/supabase-js';
import { Profile } from '../types';


type AuthData = {
    session: Session | null;
    profile: any
    loading: boolean;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthData>({
    session: null,
    profile: null,
    loading: true,
    isAdmin: false,
});

export default function AuthProvider ({children}: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchSession = async () => {
            const { data: {session} } = await supabase.auth.getSession();
            setSession(session);
           

            if (session) {
                // fetch profile
                const { data } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                setProfile(data || null);
              } 
              setLoading(false);
        }


        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            
          });
        console.log('Auth Provider Mounted');
    }, [])

    console.log(profile);
    return (
        <AuthContext.Provider value={{session, loading, profile, isAdmin: profile ?.group == 'ADMIN'}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

// import React, { useState, useEffect, useContext, createContext } from 'react';
// import { PropsWithChildren } from 'react';
// import { supabase } from '../lib/supabase'; // Adjust the import path as necessary
// import { Session } from '@supabase/supabase-js';

// interface Profile {
//   id: string;
//   group: string;
//   avatar_url: string | null;
//   full_name: string | null;
//   username: string | null;
//   website: string | null;
//   updated_at: string | null;
// }

// interface AuthContextType {
//   session: Session | null;
//   loading: boolean;
//   profile: Profile | null;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export default function AuthProvider({ children }: PropsWithChildren) {
//   const [session, setSession] = useState<Session | null>(null);
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setSession(session);

//       if (session) {
//         // fetch profile
//         const { data } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', session.user.id)
//           .single();
//         setProfile(data || null);
//       } else {
//         setProfile(null); // Reset profile to null when session is null
//       }
//       setLoading(false);
//     };

//     fetchSession();
//     const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
//       setSession(session);
//       if (session) {
//         // fetch profile
//         const { data } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', session.user.id)
//           .single();
//         setProfile(data || null);
//       } else {
//         setProfile(null); // Reset profile to null when session is null
//       }
//     });

//     return () => {
//       authListener.subscription?.unsubscribe();
//     };
//   }, []);

//   console.log(profile);
//   return (
//     <AuthContext.Provider value={{ session, loading, profile, isAdmin: profile?.group === 'ADMIN' }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };