import React, { useState } from 'react';
import { useGym } from '../context/GymContext';

export default function AuthPage() {
    const { loginUser, signUpUser } = useGym();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email || !password) {
            setErrorMessage('Please enter both an email and a password.');
            return;
        }

        try {
            if (isRegistering) {
                await signUpUser(email, password);
                alert('Account successfully registered!');
            } else {
                await loginUser(email, password);
            }
        } catch (error) {
            console.error("Authentication action failure: ", error);
            // User feedback error parsing (Robustness criteria)
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                setErrorMessage('Invalid email database or password entry.');
            } else if (error.code === 'auth/email-already-in-use') {
                setErrorMessage('This email credentials profile already exists.');
            } else {
                setErrorMessage(error.message.replace("Firebase:", ""));
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl transition-all">

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {isRegistering ? '💪 Create Athlete Profile' : '🏋️‍♂️ Member Portal Login'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {isRegistering ? 'Sign up to start tracking individual workout metrics logs.' : 'Welcome back to your real-time performance dashboard.'}
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold p-3 rounded-lg border border-red-200 dark:border-red-900/50 mb-4 animate-shake">
                        ⚠️ {errorMessage}
                    </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
                            placeholder="e.g. trainer@ironportal.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Security Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-all"
                            placeholder="••••••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-md mt-2"
                    >
                        {isRegistering ? 'Register & Initialize' : 'Secure Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800 pt-4">
                    <button
                        onClick={() => { setIsRegistering(!isRegistering); setErrorMessage(''); }}
                        className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline focus:outline-none"
                    >
                        {isRegistering ? 'Already have an active member portal? Sign In' : 'New athlete to this gym? Create an account'}
                    </button>
                </div>

            </div>
        </div>
    );
}