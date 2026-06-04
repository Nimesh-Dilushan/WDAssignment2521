import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase/config'; // Import auth from config
import {
    collection,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where // Import query operators to filter records by user
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'; // Import Firebase Auth methods
import localConfig from '../data/config.json';

const GymContext = createContext();

export const GymProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Tracks the currently logged-in user
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [config] = useState(localConfig);
    const [theme, setTheme] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    // --- DARK MODE LOGIC ---
    useEffect(() => {
        const root = window.document.documentElement;
        theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    // --- 1. AUTHENTICATION SERVICES MANAGEMENT ---
    const signUpUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logoutUser = () => {
        return signOut(auth);
    };

    // Listen for user login/logout changes across the entire app session lifecycle
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setMembers([]); // Wipe local arrays if user logs out
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // --- UPDATED LIVE CRUD WITH ACCESS CONTROL ROLES ---
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const collectionRef = collection(db, 'gym_members');
        let dynamicQuery;

        // Is the authenticated email an Administrator?
        const isAdmin = user.email === config?.adminEmail;

        if (isAdmin) {
            // Admins pull the complete cloud registry map
            dynamicQuery = collectionRef;
        } else {
            // Standard members are locked to their explicit tenant ID node
            dynamicQuery = query(collectionRef, where("userId", "==", user.uid));
        }

        const unsubscribeData = onSnapshot(dynamicQuery,
            (snapshot) => {
                const memberList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMembers(memberList);
                setLoading(false);
            },
            (error) => {
                console.error("Access Scoped Streaming Error: ", error);
                setLoading(false);
            }
        );

        return () => unsubscribeData();
    }, [user, config]);

    // CREATE: Inject user's unique identification key into the document model automatically
    const addMember = async (newMember) => {
        try {
            if (!user) return;
            const completeRecord = { ...newMember, userId: user.uid };
            await addDoc(collection(db, 'gym_members'), completeRecord);
        } catch (error) {
            console.error("Firestore Create Error: ", error);
        }
    };

    const updateMember = async (id, updatedData) => {
        try {
            const docRef = doc(db, 'gym_members', id);
            await updateDoc(docRef, updatedData);
        } catch (error) {
            console.error("Firestore Update Error: ", error);
        }
    };

    const deleteMember = async (id) => {
        try {
            const docRef = doc(db, 'gym_members', id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Firestore Delete Error: ", error);
        }
    };

    return (
        <GymContext.Provider value={{
            user,
            members,
            loading,
            config,
            theme,
            toggleTheme,
            signUpUser,
            loginUser,
            logoutUser,
            addMember,
            updateMember,
            deleteMember
        }}>
            {children}
        </GymContext.Provider>
    );
};

export const useGym = () => useContext(GymContext);