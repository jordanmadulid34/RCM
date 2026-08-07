import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AdminSupabaseDashboard } from '../components/AdminSupabaseDashboard';
import { RCMLogo } from '../components/RCMLogo';
import {
  Lock,
  Mail,
  Key,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { TabType } from '../types';

interface AdminLoginPageProps {
  setActiveTab?: (tab: TabType) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Check existing Supabase Auth session on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      setIsCheckingSession(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Verify role in 'members' table
          const { data: memberData, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!memberError && memberData && memberData.role?.toLowerCase() === 'admin') {
            setAdminUser(session.user);
            setIsAdminAuthenticated(true);
          } else {
            // Not an admin user, sign out
            await supabase.auth.signOut();
            setIsAdminAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Error verifying admin session:', err);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkAdminSession();
  }, []);

  // Handle Admin Login Submit
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        console.error('Supabase Auth login error details:', authError);
        // Display actual Supabase auth error message in error banner for debugging
        setErrorMessage(authError.message || `Auth Error (${authError.status || 'unknown'})`);
        setIsSubmitting(false);
        return;
      }

      const user = authData.user;
      if (!user) {
        setErrorMessage('Authentication failed. No user retrieved.');
        setIsSubmitting(false);
        return;
      }

      // 2. Query 'members' table for user.id and check role === 'admin'
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();

      if (memberError || !memberData || memberData.role?.toLowerCase() !== 'admin') {
        console.warn('User logged in but is not an admin:', user.id, memberData, memberError);
        // Immediately sign out non-admin user
        await supabase.auth.signOut();
        setErrorMessage('You do not have admin access.');
        setIsSubmitting(false);
        return;
      }

      // 3. Success - Confirmed Admin
      setAdminUser(user);
      setIsAdminAuthenticated(true);
    } catch (err: any) {
      console.error('Unexpected error during admin login:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogOut = () => {
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setPassword('');
  };

  // If session is being checked
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#01142E] flex flex-col items-center justify-center p-6 text-white space-y-4 font-sans">
        <Loader2 className="w-10 h-10 text-[#F7A81B] animate-spin" />
        <p className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#CBD5E1]">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // If already authenticated as Admin, show Admin Dashboard
  if (isAdminAuthenticated) {
    return (
      <AdminSupabaseDashboard
        onLogOut={handleLogOut}
        userEmail={adminUser?.email}
      />
    );
  }

  // Otherwise, render Admin Login Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01142E] via-[#011E41] to-[#0A2540] flex flex-col justify-center items-center p-4 sm:p-8 font-sans">
      <div className="max-w-md w-full space-y-8 my-10">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center cursor-pointer" onClick={() => setActiveTab && setActiveTab('Home')}>
            <RCMLogo theme="dark" size="lg" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/40 font-montserrat font-extrabold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider shadow">
              <ShieldCheck className="w-4 h-4 text-[#F7A81B]" />
              <span>Rotary Secretariat Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Admin Login
            </h1>
            <p className="text-xs text-[#CBD5E1] max-w-sm mx-auto">
              Authorized access only for Rotary Club of Makati Officers & System Administrators.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#0A2540] p-6 sm:p-8 rounded-3xl border-2 border-[#F7A81B]/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2.5 text-[#F7A81B]">
              <Lock className="w-5 h-5 shrink-0" />
              <span className="font-montserrat font-bold text-xs uppercase tracking-wider text-white">
                Secure Authentication
              </span>
            </div>
            <span className="text-[10px] font-mono bg-[#011E41] text-[#F7A81B] px-2.5 py-1 rounded-md border border-[#F7A81B]/30 font-bold">
              Supabase Auth
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs flex items-start space-x-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-montserrat font-bold text-red-300 block">Access Denied</span>
                <p className="opacity-90 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#CBD5E1] block">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  placeholder="admin@rotaryclubmakati.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#011E41] border border-[#F7A81B]/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B] focus:ring-1 focus:ring-[#F7A81B] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-montserrat font-bold uppercase tracking-wider text-[#CBD5E1] block">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#011E41] border border-[#F7A81B]/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B] focus:ring-1 focus:ring-[#F7A81B] transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-extrabold text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center space-x-2 ${
                isSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:scale-[1.01]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#011E41]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#011E41]" />
                  <span>Sign In as Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note: strictly NO public signup */}
          <div className="pt-2 text-center border-t border-white/10 space-y-3">
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Admin accounts are provisioned manually by Supabase System Administrators. Public registration is strictly disabled for security.
            </p>

            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab('Home')}
                className="text-xs text-[#F7A81B] hover:underline font-montserrat font-bold inline-flex items-center space-x-1 cursor-pointer pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
