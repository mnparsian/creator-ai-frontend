import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/auth/AuthCard';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side validation - check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return; // Do NOT call backend if passwords don't match
        }

        setIsLoading(true);

        try {
            // Only send email and password to backend (NOT confirmPassword)
            await register(email, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <AuthCard
                title="Check your email"
                subtitle="We've sent you a verification link."
                footer={
                    <>
                        Already verified?{' '}
                        <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
                            Log in
                        </Link>
                    </>
                }
            >
                <div className="text-center py-4">
                    <div className="text-4xl mb-4">📧</div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Please check your email inbox and click the verification link to activate your account.
                    </p>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Create your account"
            subtitle="Start generating content with AI."
            footer={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
                        Log in
                    </Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 text-slate-900 dark:text-slate-50"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 text-slate-900 dark:text-slate-50"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 text-slate-900 dark:text-slate-50"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-medium rounded-xl px-4 py-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    After registration, you'll receive a verification link.
                </p>
            </form>
        </AuthCard>
    );
}
