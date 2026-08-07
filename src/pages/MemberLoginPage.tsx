import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MemberDashboard } from '../components/MemberDashboard';
import { RCMLogo } from '../components/RCMLogo';
import {
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
  ArrowLeft,
  UserCheck,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { TabType } from '../types';

interface MemberLoginPageProps {
  setActiveTab?: (tab: TabType) => void;
}

export const MemberLoginPage: React.FC<MemberLoginPageProps> = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isMemberAuthenticated, setIsMemberAuthenticated] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);

  // Check existing Supabase Auth session on mount
  useEffect(() => {
    const checkMemberSession = async () => {
      setIsCheckingSession(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Query 'members' table for user.id
          const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && data) {
            setMemberData({
              ...data,
              email: session.user.email || data.email,
            });
            setIsMemberAuthenticated(true);
          } else {
            // Not registered in 'members' table, sign out
            await supabase.auth.signOut();
            setIsMemberAuthenticated(false);
            setMemberData(null);
          }
        }
      } catch (err) {
        console.error('Error verifying member session:', err);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkMemberSession();
  }, []);

  // Handle Member Login Submit
  const handleMemberLogin = async (e: React.FormEvent) => {
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
        console.error('Supabase Auth member login error:', authError);
        setErrorMessage('Invalid email address or password. Please check your credentials and try again.');
        setIsSubmitting(false);
        return;
      }

      const user = authData.user;
      if (!user) {
        setErrorMessage('Authentication failed. No user retrieved.');
        setIsSubmitting(false);
        return;
      }

      // 2. Query 'members' table for matching user.id
      const { data: mData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();

      if (memberError || !mData) {
        console.warn('User logged in but is not registered in members table:', user.id, memberError);
        // Immediately sign out non-member user
        await supabase.auth.signOut();
        setErrorMessage(
          'This account is not registered as a Rotary Club of Makati member. Please contact the Secretariat.'
        );
        setIsSubmitting(false);
        return;
      }

      // 3. Success - Valid Rotary Club Member (role can be 'member' or 'admin')
      setMemberData({
        ...mData,
        email: user.email || mData.email,
      });
      setIsMemberAuthenticated(true);
    } catch (err: any) {
      console.error('Unexpected error during member login:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = () => {
    setIsMemberAuthenticated(false);
    setMemberData(null);
  };

  // If session is being checked on initial load
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#011E41] flex flex-col items-center justify-center p-6 text-white space-y-4">
        <Loader2 className="w-10 h-10 text-[#F7A81B] animate-spin" />
        <p className="font-montserrat font-bold text-xs uppercase tracking-wider text-[#F7A81B]">
          Verifying Member Credentials...
        </p>
      </div>
    );
  }

  // If authenticated, render Member Dashboard
  if (isMemberAuthenticated && memberData) {
    return (
      <MemberDashboard
        memberData={memberData}
        onSignOut={handleSignOut}
      />
    );
  }

  // Otherwise, render Member Portal Sign In Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01142E] via-[#011E41] to-[#0A2540] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-slate-100 relative">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
        <RCMLogo className="w-[800px] h-[800px]" />
      </div>

      {/* Back Button */}
      {setActiveTab && (
        <div className="w-full max-w-md mb-6 z-10">
          <button
            type="button"
            onClick={() => setActiveTab('Home')}
            className="text-xs font-montserrat font-bold text-[#F7A81B] hover:text-white flex items-center space-x-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Return to Public Site</span>
          </button>
        </div>
      )}

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0A2540] rounded-3xl border border-[#F7A81B]/30 shadow-2xl p-6 sm:p-8 space-y-6 relative z-10 backdrop-blur-sm">
        {/* Card Header */}
        <div className="text-center space-y-3">
          <div className="h-16 px-4 bg-[#011E41] rounded-2xl border border-[#F7A81B]/40 flex items-center justify-center mx-auto shadow-inner w-fit">
            <RCMLogo className="h-10 w-auto" />
          </div>

          <div>
            <span className="inline-block bg-[#F7A81B]/20 text-[#F7A81B] border border-[#F7A81B]/30 font-montserrat font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-1">
              Rotary Club of Makati
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Member Portal Sign In
            </h1>
            <p className="text-xs text-slate-300 font-sans mt-1">
              Enter your member credentials issued by the RCM Secretariat
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-red-300 block">Sign In Failed</span>
              <p className="opacity-90 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Member Sign In Form */}
        <form onSubmit={handleMemberLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#F7A81B]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@rotaryclubmakati.org"
                className="w-full bg-[#011E41] border border-[#F7A81B]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B] focus:ring-1 focus:ring-[#F7A81B] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-montserrat font-bold uppercase tracking-wider text-slate-300">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#F7A81B]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#011E41] border border-[#F7A81B]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#F7A81B] focus:ring-1 focus:ring-[#F7A81B] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-[#F7A81B] hover:bg-[#D98E0E] text-[#01142E] font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all mt-2 cursor-pointer ${
              isSubmitting ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#01142E]" />
                <span>Verifying Member Account...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-[#01142E]" />
                <span>Sign In To Member Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Portal Access Policy Footnote */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Membership accounts are strictly managed by the RCM Secretariat. Self-registration is disabled for security.
          </p>
          <div className="flex items-center justify-center space-x-4 pt-1">
            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab('Admin')}
                className="text-[11px] font-montserrat font-bold text-[#F7A81B] hover:underline cursor-pointer"
              >
                Switch to Admin Sign In →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
