import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  Mail,
  User,
  Briefcase,
  MapPin,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ThemeType } from '../types';
import { saveApplication, ADMIN_NOTIFICATION_EMAIL } from '../services/notificationService';
import { SubmittedApplication } from '../data/rcmMemberData';
import { supabase } from '../lib/supabaseClient';

interface MembershipApplicationFormProps {
  theme?: ThemeType;
  onApplicationSubmitted?: (app: SubmittedApplication) => void;
}

const INDUSTRIES = [
  "Technology & Artificial Intelligence",
  "Healthcare / Medical & Life Sciences",
  "Finance / Banking & Wealth Management",
  "Law & Legal Services",
  "Education & Social Foundations",
  "Retail & Commerce",
  "Manufacturing & Supply Chain",
  "Real Estate & Construction",
  "Tourism & Hospitality",
  "Non-Profit & NGO",
  "Government & Diplomatic Corps",
  "Architecture & Urban Planning",
  "Other Business Sector"
];

const EXPERIENCE = [
  "Less than 2 years",
  "2–5 years",
  "6–10 years",
  "11–15 years",
  "16+ years"
];

const HEARD_OPTIONS = [
  "Friend / Current RCM Member",
  "Social Media (Facebook)",
  "Social Media (YouTube)",
  "Social Media (TikTok)",
  "Official Website / Search Engine",
  "Rotary Community Service Event",
  "Newspaper / Media Coverage",
  "Business Networking / Chamber of Commerce",
  "Other"
];

const ATTEND_OPTIONS = [
  "Yes, definitely interested in Tuesday Luncheons",
  "Interested but need schedule details",
  "Not sure yet — need more info first",
  "Prefer virtual or evening committee meetings"
];

const FOCUS_AREAS = [
  "Disease Prevention & Treatment",
  "Water, Sanitation & Hygiene",
  "Maternal & Child Health",
  "Basic Education & Literacy",
  "Community Economic Development",
  "Peacebuilding & Conflict Prevention",
  "Environmental Protection & Climate Action",
  "Open to all Rotary focus areas"
];

const CONNECTIONS = [
  "No, this is my first time engaging with Rotary",
  "Family member is/was a Rotarian",
  "Friend or colleague is in Rotary",
  "Previous Rotary / Rotaract / Interact member",
  "Attended Rotary events in the past"
];

const TERMS = [
  'I agree to uphold the Rotary Code of Conduct and Four-Way Test',
  'I have reviewed the membership expectations and classification guidelines',
  'I understand there are club dues and meeting luncheon fees',
  'I commit to the principles of "Service Above Self"'
];

const SECTIONS = [
  { label: "Personal", icon: User },
  { label: "Professional", icon: Briefcase },
  { label: "Address", icon: MapPin },
  { label: "Rotary", icon: HeartHandshake },
  { label: "Agreement", icon: ShieldCheck },
];

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  company: "",
  jobTitle: "",
  industry: "",
  experience: "",
  street: "",
  city: "Makati City",
  postal: "",
  country: "Philippines",
  whyJoin: "",
  howHeard: "",
  attendance: "",
  focusAreas: [] as string[],
  connection: "",
  additional: "",
  terms: [] as string[],
};

export const MembershipApplicationForm: React.FC<MembershipApplicationFormProps> = ({
  theme = 'dark',
  onApplicationSubmitted,
}) => {
  const isDark = theme === 'dark';
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedApp, setSubmittedApp] = useState<SubmittedApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setField = (key: keyof typeof initialData, val: any) => {
    setData((prev) => ({ ...prev, [key]: val }));
    setSubmitError(null);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleFocusArea = (area: string) => {
    setSubmitError(null);
    setData((prev) => {
      const exists = prev.focusAreas.includes(area);
      const nextArr = exists
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area];
      return { ...prev, focusAreas: nextArr };
    });
  };

  const toggleTerm = (term: string) => {
    setSubmitError(null);
    setData((prev) => {
      const exists = prev.terms.includes(term);
      const nextArr = exists
        ? prev.terms.filter((t) => t !== term)
        : [...prev.terms, term];
      return { ...prev, terms: nextArr };
    });
    if (errors.terms) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.terms;
        return next;
      });
    }
  };

  function validateStep(): boolean {
    const e: Record<string, string> = {};

    if (step === 0) {
      if (!data.firstName.trim()) e.firstName = "First name is required.";
      if (!data.lastName.trim()) e.lastName = "Last name is required.";
      if (!data.email.trim()) e.email = "Email address is required.";
      else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Please enter a valid email address.";
      if (!data.phone.trim()) e.phone = "Phone number is required.";
    }

    if (step === 1) {
      if (!data.jobTitle.trim()) e.jobTitle = "Job title/profession is required.";
      if (!data.industry) e.industry = "Please select an industry classification.";
      if (!data.experience) e.experience = "Please select your years of experience.";
    }

    if (step === 2) {
      if (!data.city.trim()) e.city = "City is required.";
    }

    if (step === 3) {
      if (!data.whyJoin.trim()) e.whyJoin = "Please share why you wish to join Rotary.";
      if (!data.howHeard) e.howHeard = "Please select how you heard about us.";
      if (!data.attendance) e.attendance = "Please select your meeting availability preference.";
      if (!data.connection) e.connection = "Please indicate if you have previous Rotary connections.";
    }

    if (step === 4) {
      if (data.terms.length < TERMS.length) e.terms = "You must accept all terms to complete your application.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleNext() {
    if (!validateStep()) return;

    if (step === SECTIONS.length - 1) {
      // Final Submit -> Save to Supabase & local state & notify
      setIsSubmitting(true);
      setSubmitError(null);

      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
      const classification = `${data.jobTitle.trim()} (${data.industry})`;
      const fullMessage = `[Why Join]: ${data.whyJoin}\n[Focus Areas]: ${data.focusAreas.join(', ') || 'All'}\n[Attendance]: ${data.attendance}\n[How Heard]: ${data.howHeard}\n[Address]: ${data.street}, ${data.city}, ${data.country}\n[Experience]: ${data.experience}\n[Connection]: ${data.connection}`;

      // Insert record into Supabase membership_applications table matching column schema
      const supabasePayload = {
        full_name: fullName,
        email: data.email.trim(),
        phone: data.phone.trim(),
        company: data.company.trim() || 'N/A',
        classification: classification,
        message: fullMessage,
        why_join: data.whyJoin.trim(),
        how_heard: data.howHeard,
        attendance: data.attendance,
        focus_areas: data.focusAreas,
        connection: data.connection,
        additional: data.additional.trim() || null,
        source: 'Online Application Form',
        status: 'Pending Review'
      };

      try {
        const { error } = await supabase
          .from('membership_applications')
          .insert([supabasePayload]);

        if (error) {
          console.error('Supabase application submission error:', error);
          const errorCodeStr = error.code ? ` (Code: ${error.code})` : '';
          setSubmitError(`Database submission error${errorCodeStr}: ${error.message}`);
          setIsSubmitting(false);
          return;
        }

        // Save locally for application tracker & session state only after confirmed Supabase insert success
        const newApp = saveApplication({
          fullName,
          email: data.email.trim(),
          phone: data.phone.trim(),
          company: data.company.trim() || 'N/A',
          classification,
          message: fullMessage,
          source: 'Online Application Form',
        });

        setSubmittedApp(newApp);
        setIsSubmitting(false);
        if (onApplicationSubmitted) {
          onApplicationSubmitted(newApp);
        }
      } catch (err: any) {
        console.error('Unexpected submission error:', err);
        setSubmitError(err?.message || 'An unexpected network error occurred while submitting your application.');
        setIsSubmitting(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  // SUCCESS / CONFIRMATION SCREEN
  if (submittedApp) {
    return (
      <div
        className={`p-6 sm:p-10 rounded-3xl border shadow-2xl space-y-8 animate-fadeIn ${
          isDark
            ? 'bg-[#011E41] border-[#F7A81B]/40 text-[#F5F1E6]'
            : 'bg-[#FAF8F3] border-[#011E41]/20 text-[#011E41]'
        }`}
      >
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F7A81B]/20 text-[#F7A81B] border-2 border-[#F7A81B] flex items-center justify-center mx-auto shadow-lg">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="bg-[#F7A81B] text-[#011E41] font-mono font-bold text-xs px-3.5 py-1 rounded-full inline-block">
              Ref ID: {submittedApp.id}
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-[#F7A81B] pt-2">
              Application Successfully Received
            </h2>
          </div>

          <p className="font-sans text-sm opacity-90 leading-relaxed">
            Thank you, <strong>{data.firstName}</strong>. Our Membership Committee will review your application and reach out within 3–5 business days to coordinate your guest attendance at our Tuesday luncheon.
          </p>
        </div>

        {/* Email Dispatches Simulated Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-[#011E41]/15'
            }`}
          >
            <div className="flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs">
              <Mail className="w-4 h-4" />
              <span>Admin Notification Dispatched</span>
            </div>
            <p className="text-xs font-mono opacity-85 leading-snug">
              Recipient: <strong className="text-[#F7A81B]">{ADMIN_NOTIFICATION_EMAIL}</strong><br />
              Subject: New Membership Application Received — {data.firstName} {data.lastName}
            </p>
          </div>

          <div
            className={`p-5 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-[#011E41]/15'
            }`}
          >
            <div className="flex items-center space-x-2 text-emerald-400 font-montserrat font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Applicant Confirmation Sent</span>
            </div>
            <p className="text-xs font-mono opacity-85 leading-snug">
              Recipient: <strong className="text-emerald-400">{data.email}</strong><br />
              Subject: Thank you for applying to Rotary Club of Makati!
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-[#F7A81B]/20">
          <button
            type="button"
            onClick={() => {
              setSubmittedApp(null);
              setStep(0);
              setData(initialData);
              setErrors({});
            }}
            className="w-full sm:w-auto bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Start Another Application
          </button>
        </div>
      </div>
    );
  }

  // 5-STEP FORM WIZARD
  return (
    <div
      className={`p-6 sm:p-10 rounded-3xl border shadow-2xl space-y-8 ${
        isDark
          ? 'bg-[#121212] border-[#F7A81B]/30 text-[#F5F1E6]'
          : 'bg-[#FAF8F3] border-[#011E41]/20 text-[#011E41]'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[#F7A81B] font-montserrat font-extrabold text-xs uppercase tracking-widest block">
            Rotary Club of Makati • Membership Application
          </span>
          <h2 className={`font-serif text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
            Service Above Self — Join Our Legacy
          </h2>
          <p className="text-xs font-sans opacity-80">
            Complete the 5-step application wizard below. Required fields are marked with an asterisk (<span className="text-red-400">*</span>).
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setData({
              firstName: "Juan",
              lastName: "Dela Cruz",
              email: "juan.delacruz@example.ph",
              phone: "+63 917 123 4567",
              dob: "1988-05-15",
              company: "Makati Tech Ventures",
              jobTitle: "Senior Director",
              industry: "Technology & Artificial Intelligence",
              experience: "11–15 years",
              street: "Ayala Avenue, Legazpi Village",
              city: "Makati City",
              postal: "1226",
              country: "Philippines",
              whyJoin: "Eager to contribute business strategy and AI skills to RC Makati community service projects.",
              howHeard: "Official Website / Search Engine",
              attendance: "Yes, definitely interested in Tuesday Luncheons",
              focusAreas: ["Basic Education & Literacy", "Community Economic Development"],
              connection: "Attended Rotary events in the past",
              additional: "Excited to join RC Makati's legacy of leadership.",
              terms: [
                'I agree to uphold the Rotary Code of Conduct and Four-Way Test',
                'I have reviewed the membership expectations and classification guidelines',
                'I understand there are club dues and meeting luncheon fees',
                'I commit to the principles of "Service Above Self"'
              ],
            });
            setErrors({});
          }}
          className="shrink-0 bg-[#F7A81B]/20 hover:bg-[#F7A81B]/30 text-[#F7A81B] border border-[#F7A81B]/40 font-montserrat font-bold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F7A81B]" />
          <span>⚡ Auto-Fill Sample Data</span>
        </button>
      </div>

      {/* Stepper Bar */}
      <div className="flex items-center justify-between overflow-x-auto pb-4 no-scrollbar">
        {SECTIONS.map((sec, idx) => {
          const Icon = sec.icon;
          const isActive = idx === step;
          const isDone = idx < step;

          return (
            <React.Fragment key={sec.label}>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (idx < step) setStep(idx);
                  }}
                  disabled={idx > step}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isDone
                      ? 'bg-[#011E41] text-[#F7A81B] border-2 border-[#F7A81B]'
                      : isActive
                      ? 'bg-[#F7A81B] text-[#011E41] shadow-lg scale-110'
                      : isDark
                      ? 'bg-white/10 text-white/50 border border-white/20'
                      : 'bg-[#011E41]/10 text-[#011E41]/60 border border-[#011E41]/20'
                  }`}
                >
                  {isDone ? <Check className="w-5 h-5 text-[#F7A81B]" /> : <Icon className="w-4 h-4" />}
                </button>
                <span
                  className={`text-[11px] font-montserrat font-bold uppercase tracking-wider ${
                    isActive ? 'text-[#F7A81B]' : 'opacity-60'
                  }`}
                >
                  {sec.label}
                </span>
              </div>

              {idx < SECTIONS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 min-w-[20px] transition-all ${
                    idx < step ? 'bg-[#F7A81B]' : isDark ? 'bg-white/20' : 'bg-[#011E41]/20'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* FORM BODY */}
      <div className="space-y-6 pt-2">
        {/* STEP 0: PERSONAL INFORMATION */}
        {step === 0 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif font-bold text-lg text-[#F7A81B] flex items-center space-x-2 border-b border-[#F7A81B]/20 pb-2">
              <User className="w-5 h-5" />
              <span>Step 1: Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  placeholder="Juan"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.firstName
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.firstName && <p className="text-[11px] text-red-400">{errors.firstName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  placeholder="Dela Cruz"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.lastName
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.lastName && <p className="text-[11px] text-red-400">{errors.lastName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="juan@example.ph"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.email
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Mobile / Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+63 917 123 4567"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.phone
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Date of Birth <span className="text-xs opacity-60 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={data.dob}
                  onChange={(e) => setField('dob', e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]' : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: PROFESSIONAL BACKGROUND */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif font-bold text-lg text-[#F7A81B] flex items-center space-x-2 border-b border-[#F7A81B]/20 pb-2">
              <Briefcase className="w-5 h-5" />
              <span>Step 2: Professional Background & Classification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Company / Business / Organization Name
                </label>
                <input
                  type="text"
                  value={data.company}
                  onChange={(e) => setField('company', e.target.value)}
                  placeholder="e.g. Makati Tech Enterprises Corp."
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]' : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Job Title / Profession <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.jobTitle}
                  onChange={(e) => setField('jobTitle', e.target.value)}
                  placeholder="e.g. Managing Director / Partner"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.jobTitle
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.jobTitle && <p className="text-[11px] text-red-400">{errors.jobTitle}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Industry Classification <span className="text-red-400">*</span>
                </label>
                <select
                  value={data.industry}
                  onChange={(e) => setField('industry', e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.industry
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41] text-white'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                >
                  <option value="">Select industry classification</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} className={isDark ? 'bg-[#011E41] text-white' : 'bg-white text-[#011E41]'}>
                      {ind}
                    </option>
                  ))}
                </select>
                {errors.industry && <p className="text-[11px] text-red-400">{errors.industry}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Years of Professional Experience <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {EXPERIENCE.map((exp) => (
                    <label
                      key={exp}
                      className={`p-3 rounded-xl border text-xs font-montserrat font-bold cursor-pointer transition-all flex items-center space-x-2 ${
                        data.experience === exp
                          ? 'bg-[#F7A81B] text-[#011E41] border-[#F7A81B]'
                          : isDark
                          ? 'border-white/20 bg-[#011E41]/40 text-[#F5F1E6] hover:border-white/40'
                          : 'border-[#011E41]/20 bg-white text-[#011E41] hover:border-[#011E41]/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        checked={data.experience === exp}
                        onChange={() => setField('experience', exp)}
                        className="accent-[#011E41]"
                      />
                      <span>{exp}</span>
                    </label>
                  ))}
                </div>
                {errors.experience && <p className="text-[11px] text-red-400">{errors.experience}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ADDRESS */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif font-bold text-lg text-[#F7A81B] flex items-center space-x-2 border-b border-[#F7A81B]/20 pb-2">
              <MapPin className="w-5 h-5" />
              <span>Step 3: Location & Business Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Street Address / Building
                </label>
                <input
                  type="text"
                  value={data.street}
                  onChange={(e) => setField('street', e.target.value)}
                  placeholder="e.g. Ayala Tower One, Ayala Avenue"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]' : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setField('city', e.target.value)}
                  placeholder="Makati City"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.city
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-red-400">{errors.city}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={data.postal}
                  onChange={(e) => setField('postal', e.target.value)}
                  placeholder="1200"
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]' : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Country
                </label>
                <input
                  type="text"
                  value={data.country}
                  onChange={(e) => setField('country', e.target.value)}
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    isDark ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]' : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ROTARY INTEREST & ENGAGEMENT */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif font-bold text-lg text-[#F7A81B] flex items-center space-x-2 border-b border-[#F7A81B]/20 pb-2">
              <HeartHandshake className="w-5 h-5" />
              <span>Step 4: Rotary Engagement & Service Intent</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Why do you want to join the Rotary Club of Makati? <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={data.whyJoin}
                  onChange={(e) => setField('whyJoin', e.target.value)}
                  placeholder="Tell us about your drive for community service and fellowship..."
                  className={`w-full p-3 rounded-xl border text-xs font-sans ${
                    errors.whyJoin
                      ? 'border-red-500 bg-red-500/10'
                      : isDark
                      ? 'border-white/20 bg-[#011E41]/60 text-[#F5F1E6]'
                      : 'border-[#011E41]/30 bg-white text-[#011E41]'
                  }`}
                />
                {errors.whyJoin && <p className="text-[11px] text-red-400">{errors.whyJoin}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    How did you hear about RC Makati? <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={data.howHeard}
                    onChange={(e) => setField('howHeard', e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-sans ${
                      errors.howHeard
                        ? 'border-red-500 bg-red-500/10'
                        : isDark
                        ? 'border-white/20 bg-[#011E41] text-white'
                        : 'border-[#011E41]/30 bg-white text-[#011E41]'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {HEARD_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className={isDark ? 'bg-[#011E41] text-white' : 'bg-white text-[#011E41]'}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.howHeard && <p className="text-[11px] text-red-400">{errors.howHeard}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                    Meeting Availability <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={data.attendance}
                    onChange={(e) => setField('attendance', e.target.value)}
                    className={`w-full p-3 rounded-xl border text-xs font-sans ${
                      errors.attendance
                        ? 'border-red-500 bg-red-500/10'
                        : isDark
                        ? 'border-white/20 bg-[#011E41] text-white'
                        : 'border-[#011E41]/30 bg-white text-[#011E41]'
                    }`}
                  >
                    <option value="">Select meeting preference</option>
                    {ATTEND_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className={isDark ? 'bg-[#011E41] text-white' : 'bg-white text-[#011E41]'}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.attendance && <p className="text-[11px] text-red-400">{errors.attendance}</p>}
                </div>
              </div>

              {/* Focus Areas Checkboxes */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Which Rotary Focus Areas Interest You Most?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FOCUS_AREAS.map((area) => {
                    const checked = data.focusAreas.includes(area);
                    return (
                      <label
                        key={area}
                        className={`p-2.5 rounded-xl border text-xs font-sans cursor-pointer transition-all flex items-center space-x-2 ${
                          checked
                            ? 'bg-[#F7A81B]/20 border-[#F7A81B] text-[#F7A81B] font-semibold'
                            : isDark
                            ? 'border-white/10 bg-[#011E41]/40 text-[#F5F1E6] hover:border-white/30'
                            : 'border-[#011E41]/20 bg-white text-[#011E41] hover:border-[#011E41]/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFocusArea(area)}
                          className="accent-[#F7A81B]"
                        />
                        <span>{area}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-montserrat font-bold uppercase tracking-wider block">
                  Rotary Connections <span className="text-red-400">*</span>
                </label>
                <div className="space-y-1.5">
                  {CONNECTIONS.map((conn) => (
                    <label
                      key={conn}
                      className={`p-2.5 rounded-xl border text-xs font-sans cursor-pointer flex items-center space-x-2 ${
                        data.connection === conn
                          ? 'bg-[#F7A81B]/20 border-[#F7A81B] text-[#F7A81B] font-semibold'
                          : isDark
                          ? 'border-white/10 bg-[#011E41]/40 text-[#F5F1E6] hover:border-white/30'
                          : 'border-[#011E41]/20 bg-white text-[#011E41] hover:border-[#011E41]/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="connection"
                        checked={data.connection === conn}
                        onChange={() => setField('connection', conn)}
                        className="accent-[#F7A81B]"
                      />
                      <span>{conn}</span>
                    </label>
                  ))}
                </div>
                {errors.connection && <p className="text-[11px] text-red-400">{errors.connection}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: AGREEMENT & CODE OF CONDUCT */}
        {step === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif font-bold text-lg text-[#F7A81B] flex items-center space-x-2 border-b border-[#F7A81B]/20 pb-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Step 5: Code of Conduct & Application Agreement</span>
            </h3>

            <p className="text-xs font-sans opacity-85 leading-relaxed">
              Rotary is dedicated to high ethical standards in business and professions. Please review and confirm each of the commitments below:
            </p>

            <div className="space-y-3 pt-2">
              {TERMS.map((term) => {
                const checked = data.terms.includes(term);
                return (
                  <label
                    key={term}
                    className={`p-3.5 rounded-2xl border text-xs font-sans cursor-pointer transition-all flex items-start space-x-3 ${
                      checked
                        ? 'bg-[#F7A81B]/15 border-[#F7A81B] text-[#F5F1E6]'
                        : isDark
                        ? 'border-white/20 bg-[#011E41]/40 text-[#F5F1E6] hover:border-white/40'
                        : 'border-[#011E41]/20 bg-white text-[#011E41] hover:border-[#011E41]/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTerm(term)}
                      className="mt-0.5 accent-[#F7A81B]"
                    />
                    <span className="leading-snug">{term}</span>
                  </label>
                );
              })}
            </div>

            {errors.terms && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
                {errors.terms}
              </div>
            )}
          </div>
        )}
      </div>

      {submitError && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-start space-x-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-300 block">Submission Error</span>
            <p className="opacity-90">{submitError}</p>
          </div>
        </div>
      )}

      {/* FOOTER NAVIGATION CONTROLS */}
      <div className="pt-6 border-t border-[#F7A81B]/20 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0 || isSubmitting}
          className={`px-5 py-3 rounded-xl font-montserrat font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
            step === 0 || isSubmitting
              ? 'opacity-40 cursor-not-allowed border border-slate-400/20'
              : isDark
              ? 'border border-white/30 hover:bg-white/10 text-[#F5F1E6] cursor-pointer'
              : 'border border-[#011E41]/30 hover:bg-[#011E41]/10 text-[#011E41] cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className={`bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 ${
            isSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#011E41]" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <span>{step === SECTIONS.length - 1 ? 'Submit Application' : 'Continue'}</span>
              {step === SECTIONS.length - 1 ? <Send className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
