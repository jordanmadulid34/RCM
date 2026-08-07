import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Youtube,
  Instagram,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Navigation,
  MessageSquare,
  Building2
} from 'lucide-react';
import { ThemeType } from '../types';
import { RCM_INFO } from '../data/rcmData';
import banner1 from '../assets/membership-banner/1.jpeg';

interface ContactPageProps {
  theme: ThemeType;
}

const ATTACHMENT_BG_LINK =
  'https://chat.google.com/u/0/api/get_attachment_url?url_type=FIFE_URL&content_type=image%2Fpng&attachment_token=AOo0EEXusLIZgjX%2BsmUgswWDa%2BPhEg%2B6OY5vm3MDGhL%2BjLqi5cfb1X6K%2FUlsWj6r7f5lRPqVDxxUOFdz6kD%2BRPLvIzU%2BjmVxOv69AfO%2F2v7IynBe4Q3bQZXabdkGI0tp1kTL11bwIfV09%2BcDo6hu%2FxwEfCxEVhHLuScW9HEZ9flmfHD0g5y7T0pF3cjhMLOzFoSAM%2Flr87nFmWbVIE0Snt6oj4C2%2BDQP36De2ZFpg%2FuWMDb%2B%2BRsQezx%2FvOG6Yl6gotdnakHbcc4wO%2BLI7016dQxhvwko0ejAFDXG9oRLXsuuE9byPXpACqByP9abl2ZQQ6csLx1dMoKg1pxONUq7SnDjVih9uzLlU29iD6K7RpmFglChBDco0ETZd%2FRpEFz2lEJwGr%2F%2Fz9ErHbirIxX%2BiFw0SycRP3qaMWT0gKMmsFUgzTPojGVEC6TMHSxQE0RCnrDhcDHxNAG3mcwM7VQ2hmc99LeybHQMdufXljG%2B5tW6bfp6A1eX%2Bf9WicN6H2RRm1XlDE5IT1lcyk13XGNP%2B43SrzjbXnP1N72%2Fx8iMz3oicF8zgyGoX8SK23luH6a1ca10fv0hSpsir9IszZa13VXiyxfnecO7%2BoTiPnZ8f4hZRzOVxp4j%2BmmEKd0Uz%2FMXyqIN%2Fvj5rNA9&allow_caching=true&sz=w512';

const CONNECT_BG_PHOTOS = [
  {
    id: 0,
    src: ATTACHMENT_BG_LINK,
    fallbackSrc: banner1,
    alt: 'Rotary Club of Makati Secretariat Headquarters',
  },
  {
    id: 1,
    src: 'https://static.wixstatic.com/media/b2fb7d_9946319f5a2845d18303c2396cb5011a~mv2.jpg',
    fallbackSrc: '/membership-banner/1.jpeg',
    alt: 'RC Makati community service event — community entrepreneurship and livelihood development',
  },
  {
    id: 2,
    src: 'https://static.wixstatic.com/media/b2fb7d_a9b11276feb747a9a98acbff46597292~mv2.jpg',
    fallbackSrc: '/membership-banner/2.jpeg',
    alt: 'RC Makati community service event — dental and medical outreach mission',
  },
  {
    id: 3,
    src: 'https://static.wixstatic.com/media/b2fb7d_7120845956ba471a8faed4ec2c05839c~mv2.jpg',
    fallbackSrc: '/membership-banner/3.jpeg',
    alt: 'RC Makati community service event — marine reef preservation and coastal protection',
  },
  {
    id: 4,
    src: 'https://static.wixstatic.com/media/b2fb7d_b1fbf77300f9440ca4f20030468fcc2c~mv2.jpg',
    fallbackSrc: '/membership-banner/4.jpeg',
    alt: 'RC Makati community service event — youth career guidance and educational mentorship',
  },
  {
    id: 5,
    src: 'https://static.wixstatic.com/media/b2fb7d_ca7371be21054818ab83365c2c4cdbcd~mv2.jpg',
    fallbackSrc: '/membership-banner/5.jpeg',
    alt: 'RC Makati community service event — rural community outreach and humanitarian aid',
  },
  {
    id: 6,
    src: 'https://static.wixstatic.com/media/941b16_c7f3a903128341189db574743bf22539~mv2.jpg',
    fallbackSrc: '/membership-banner/6.jpeg',
    alt: 'RC Makati community service event — maternal and child healthcare initiative',
  },
  {
    id: 7,
    src: 'https://static.wixstatic.com/media/941b16_1b106fe9c46d451f9f0c679ca331457d~mv2.jpeg',
    fallbackSrc: '/membership-banner/7.jpeg',
    alt: 'RC Makati community service event — clean water access and sanitation project',
  },
  {
    id: 8,
    src: 'https://static.wixstatic.com/media/941b16_b5dbc984533b429297f98f66bc19d746~mv2.jpeg',
    fallbackSrc: '/membership-banner/8.jpeg',
    alt: 'RC Makati community service event — basic education and literacy development',
  },
  {
    id: 9,
    src: 'https://static.wixstatic.com/media/941b16_10efc9654d1a499da8c4554a5febda96~mv2.jpeg',
    fallbackSrc: '/membership-banner/9.jpeg',
    alt: 'RC Makati community service event — club fellowship and service milestone celebration',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({ theme }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bgErrors, setBgErrors] = useState<Record<number, boolean>>({});
  const [tabBgSrc, setTabBgSrc] = useState<string>(ATTACHMENT_BG_LINK);

  useEffect(() => {
    CONNECT_BG_PHOTOS.forEach((photo) => {
      const img = new Image();
      img.src = encodeURI(photo.src);
      const fallbackImg = new Image();
      fallbackImg.src = photo.fallbackSrc;
    });
  }, []);

  const handleBgError = (id: number) => {
    setBgErrors((prev) => ({ ...prev, [id]: true }));
  };

  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.subject || !contactForm.message.trim()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            full_name: contactForm.name.trim(),
            email: contactForm.email.trim(),
            phone: contactForm.phone.trim() || null,
            subject: contactForm.subject,
            message: contactForm.message.trim(),
          },
        ]);

      if (error) {
        console.error('Supabase contact message submission error:', error);
        console.error('FULL ERROR DETAILS:', JSON.stringify(error, null, 2));
        const errorCodeStr = error.code ? ` (Code: ${error.code})` : '';
        setSubmitError(`Database submission error${errorCodeStr}: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Unexpected error submitting contact message:', err);
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen animate-fadeIn bg-[#0D1B2A] overflow-hidden">
      {/* FULL CONTACT US TAB BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={tabBgSrc}
          alt="Contact Us Tab Background"
          referrerPolicy="no-referrer"
          onError={() => setTabBgSrc('/membership-banner/1.jpeg')}
          className="w-full h-full object-cover object-center opacity-30 fixed"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/90 via-[#011E41]/85 to-[#0D1B2A]/95 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10">
        {/* HERO BAND ("Let's Connect" Section - Full-Width Edge-to-Edge) */}
      <section
        aria-label="Contact Us Banner"
        className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center min-h-[320px] sm:min-h-[360px] bg-[#0D1B2A]"
      >
        {/* Layer 0 (z-0): Rotating Background Photo Effect at the base */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          {CONNECT_BG_PHOTOS.map((photo, idx) => {
            const isError = bgErrors[photo.id];
            const imgSrc = isError ? photo.fallbackSrc : encodeURI(photo.src);

            return (
              <div
                key={photo.id}
                className="absolute inset-0 w-full h-full animate-photo-fade-scale opacity-0"
                style={{
                  animationDelay: `${idx * 5}s`,
                }}
              >
                <img
                  src={imgSrc}
                  alt={photo.alt}
                  referrerPolicy="no-referrer"
                  onError={() => handleBgError(photo.id)}
                  className="w-full h-full object-cover object-center"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            );
          })}
        </div>

        {/* Layer 1 (z-10): Dark Navy Overlay above the photo background */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ backgroundColor: 'rgba(13, 27, 42, 0.74)' }}
        />

        {/* Layer 2 (z-20): Existing text content on top with the highest z-index */}
        <div className="relative z-20 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#F7A81B] font-montserrat font-bold text-xs uppercase tracking-widest bg-[#011E41]/80 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-md">
            <Mail className="w-3.5 h-3.5 text-[#F7A81B]" />
            <span>Contact Us</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F1E6]">
            Let's Connect
          </h1>
          <p className="text-sm sm:text-base font-sans font-light leading-relaxed max-w-2xl mx-auto text-[#F5F1E6]/90">
            Whether you're interested in membership, a project partnership, or just want to say hello — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER FOR CONTACT PAGE CONTENT */}
      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* TWO-COLUMN UNIFIED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT COLUMN: Unified Map & Secretariat Info Card */}
        <div className="lg:col-span-5 flex flex-col">
          <div
            className={`rounded-3xl border shadow-xs flex flex-col justify-between h-full overflow-hidden transition-all duration-300 ${
              isDark
                ? 'bg-[#011E41] border-[#F7A81B]/30 text-[#F5F1E6]'
                : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447]'
            }`}
          >
            {/* Integrated Map Container Header */}
            <div className="relative w-full h-56 sm:h-64 bg-[#0a111a] border-b border-[#F7A81B]/25 overflow-hidden group">
              {/* Location and hours verified via Rotary Club of Makati's official Google Business Profile */}
              <iframe
                title="Rotary Club of Makati Location Map"
                src="https://maps.google.com/maps?q=14.5640895,121.0397706(Rotary%20Club%20of%20Makati)&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                className={`w-full h-full border-0 transition-opacity duration-300 ${
                  isDark ? 'filter invert-[0.88] hue-rotate-180 brightness-[0.95] contrast-[1.1] opacity-90' : 'opacity-100'
                }`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Overlay Badge & Get Directions Button */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center space-x-1.5 bg-[#011E41]/90 text-[#F7A81B] border border-[#F7A81B]/50 text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-md">
                  <MapPin className="w-3 h-3 text-[#F7A81B]" />
                  <span>Makati Headquarters</span>
                </span>
              </div>

              <div className="absolute bottom-3 right-3 z-10">
                <a
                  href="https://maps.google.com/?cid=12703290198424636798"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-[#F7A81B] hover:bg-[#D98E0E] text-[#011E41] font-montserrat font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  <Navigation className="w-3 h-3 fill-current" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Card Content Details */}
            <div className="p-6 sm:p-7 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-2.5 text-[#F7A81B]">
                  <Building2 className="w-5 h-5" />
                  <h2 className={`font-serif text-xl sm:text-2xl font-bold ${isDark ? 'text-[#F5F1E6]' : 'text-[#011E41]'}`}>
                    Secretariat & Office
                  </h2>
                </div>

                <div className="space-y-4 text-xs sm:text-sm font-sans">
                  {/* Address */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#F7A81B] shrink-0 mt-1" />
                    <div>
                      <strong className="block font-serif text-sm font-bold text-[#F7A81B]">
                        {RCM_INFO.office.building}
                      </strong>
                      <p className="opacity-85 text-xs leading-relaxed mt-0.5">
                        {RCM_INFO.office.address}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-3 pt-2.5 border-t border-[#F7A81B]/15">
                    <Phone className="w-4 h-4 text-[#F7A81B] shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase font-montserrat font-extrabold text-[#F7A81B] opacity-80">
                        Telephone Lines
                      </span>
                      <a
                        href="tel:+6328997863"
                        className="font-semibold text-xs sm:text-sm hover:text-[#F7A81B] transition-colors"
                      >
                        {RCM_INFO.office.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-3 pt-2.5 border-t border-[#F7A81B]/15">
                    <Mail className="w-4 h-4 text-[#F7A81B] shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase font-montserrat font-extrabold text-[#F7A81B] opacity-80">
                        Email Secretariat
                      </span>
                      <a
                        href={`mailto:${RCM_INFO.office.email}`}
                        className="font-semibold text-xs sm:text-sm hover:text-[#F7A81B] transition-colors underline decoration-[#F7A81B]/40"
                      >
                        {RCM_INFO.office.email}
                      </a>
                    </div>
                  </div>

                  {/* Office Hours Table */}
                  <div className="flex items-start space-x-3 pt-2.5 border-t border-[#F7A81B]/15">
                    <Clock className="w-4 h-4 text-[#F7A81B] shrink-0 mt-0.5" />
                    <div className="w-full space-y-1.5">
                      <span className="block text-[10px] uppercase font-montserrat font-extrabold text-[#F7A81B] opacity-80">
                        Secretariat Hours
                      </span>
                      <div className="w-full space-y-1 text-xs">
                        {RCM_INFO.office.hours.map((schedule, i) => (
                          <div key={i} className="flex justify-between items-center text-xs opacity-90 pb-0.5">
                            <span className="font-medium">{schedule.days}</span>
                            <span className="font-bold text-[#F7A81B]">{schedule.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Row */}
              <div className="pt-4 border-t border-[#F7A81B]/20 space-y-2">
                <span className="block text-[10px] font-montserrat font-extrabold uppercase tracking-wider text-[#F7A81B]">
                  Official Social Channels
                </span>
                <div className="flex items-center space-x-2">
                  <a
                    href={RCM_INFO.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-9 h-9 rounded-xl bg-[#011E41] border border-[#F7A81B]/40 hover:border-[#F7A81B] text-[#F7A81B] flex items-center justify-center transition-all hover:scale-105 shadow-sm cursor-pointer"
                  >
                    <Youtube className="w-4 h-4 text-[#FF0000]" />
                  </a>
                  <a
                    href={RCM_INFO.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-xl bg-[#011E41] border border-[#F7A81B]/40 hover:border-[#F7A81B] text-[#F7A81B] flex items-center justify-center transition-all hover:scale-105 shadow-sm cursor-pointer"
                  >
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                  </a>
                  <a
                    href={RCM_INFO.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-9 h-9 rounded-xl bg-[#011E41] border border-[#F7A81B]/40 hover:border-[#F7A81B] text-[#F7A81B] flex items-center justify-center transition-all hover:scale-105 shadow-sm cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 text-[#E4405F]" />
                  </a>
                  <a
                    href={RCM_INFO.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-9 h-9 rounded-xl bg-[#011E41] border border-[#F7A81B]/40 hover:border-[#F7A81B] text-[#F7A81B] flex items-center justify-center transition-all hover:scale-105 shadow-sm cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-cyan-400" viewBox="0 0 24 24">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.812c-1.611 0-2.903-1.304-2.903-2.903 0-1.6 1.3-2.903 2.903-2.903.35 0 .684.062 1.002.175V9.227a6.29 6.29 0 0 0-1.002-.08C6.012 9.147 3 12.16 3 15.683 3 19.205 6.012 22 9.473 22c3.46 0 6.472-2.795 6.472-6.317V9.008a8.196 8.196 0 0 0 4.644 1.442v-3.44c-.334 0-.663-.08-.998-.324z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sleek Contact Form */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            className={`p-6 sm:p-8 lg:p-9 rounded-3xl border shadow-xs flex flex-col justify-between h-full ${
              isDark ? 'bg-[#011E41] border-[#F7A81B]/30 text-[#F5F1E6]' : 'bg-[#F2EFE8] border-[#243447]/10 text-[#243447]'
            }`}
          >
            {submitted ? (
              <div className="py-12 my-auto text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#17458F]/10 text-[#17458F] mx-auto flex items-center justify-center border border-[#17458F]/30 shadow-xs">
                  <CheckCircle2 className="w-10 h-10 text-[#C9982B]" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17458F]">
                    Message Sent Successfully!
                  </h2>
                  <p className="font-sans text-sm opacity-90 leading-relaxed pt-2">
                    Thank you for reaching out — we'll get back to you within 2-3 business days.
                  </p>
                  <p className="text-xs font-sans text-[#17458F] font-semibold pt-1">
                    Confirmation copy sent to: {contactForm.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitError(null);
                    setContactForm({
                      name: '',
                      email: '',
                      phone: '',
                      subject: 'General Inquiry',
                      message: '',
                    });
                  }}
                  className="bg-[#17458F] hover:bg-[#1D5CB8] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl cursor-pointer transition-all shadow-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 my-auto">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 text-[10px] font-montserrat font-extrabold uppercase tracking-widest text-[#17458F] bg-[#17458F]/10 px-3 py-1 rounded-full border border-[#17458F]/20">
                    <MessageSquare className="w-3 h-3 text-[#C9982B]" />
                    <span>Inquiry Form</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold pt-1 text-[#243447] dark:text-[#F5F1E6]">
                    Send Us A Direct Message
                  </h2>
                  <p className="text-xs font-sans text-[#4A5565] dark:text-[#CBD5E1] leading-relaxed">
                    Fill out the form below and the RC Makati Secretariat will connect with you promptly.
                  </p>
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

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#17458F]">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Juan dela Cruz"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#17458F]/50 transition-all ${
                        isDark ? 'bg-[#0a1422] border-[#F7A81B]/30 text-[#F5F1E6] placeholder-[#F5F1E6]/40' : 'bg-[#EEE9E0] border-[#243447]/15 text-[#243447] placeholder-[#4A5565]/50'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#17458F]">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="juan@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#17458F]/50 transition-all ${
                        isDark ? 'bg-[#0a1422] border-[#F7A81B]/30 text-[#F5F1E6] placeholder-[#F5F1E6]/40' : 'bg-[#EEE9E0] border-[#243447]/15 text-[#243447] placeholder-[#4A5565]/50'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone & Subject Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#17458F]">
                      Phone Number <span className="opacity-60 text-[10px] font-normal lowercase">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+63 917 000 0000"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#17458F]/50 transition-all ${
                        isDark ? 'bg-[#0a1422] border-[#F7A81B]/30 text-[#F5F1E6] placeholder-[#F5F1E6]/40' : 'bg-[#EEE9E0] border-[#243447]/15 text-[#243447] placeholder-[#4A5565]/50'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#17458F]">
                      Subject / Topic *
                    </label>
                    <select
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#17458F]/50 transition-all ${
                        isDark ? 'bg-[#0a1422] border-[#F7A81B]/30 text-[#F5F1E6]' : 'bg-[#EEE9E0] border-[#243447]/15 text-[#243447]'
                      }`}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Membership Interest">Membership Interest</option>
                      <option value="Project Partnership">Project Partnership</option>
                      <option value="Media / Press">Media / Press</option>
                      <option value="Donation">Donation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#17458F]">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="How can we assist you?"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#17458F]/50 transition-all ${
                      isDark ? 'bg-[#0a1422] border-[#F7A81B]/30 text-[#F5F1E6] placeholder-[#F5F1E6]/40' : 'bg-[#EEE9E0] border-[#243447]/15 text-[#243447] placeholder-[#4A5565]/50'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#17458F] hover:bg-[#1D5CB8] text-white font-montserrat font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all ${
                    isSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Send Message To Secretariat</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* CLOSING SECTION: SLIM REMINDER BANNER */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 ${
          isDark
            ? 'bg-[#011E41] border-[#F7A81B]/30 text-[#F5F1E6]'
            : 'bg-[#EEE9E0] border-[#243447]/10 text-[#243447]'
        }`}
      >
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17458F]">
            Prefer to visit in person?
          </h3>
          <p className="text-xs sm:text-sm font-sans text-[#4A5565] leading-relaxed">
            MRCFI Building, 8001 Camia St., Guadalupe Viejo • Mon–Thu 7:30 AM–5:30 PM | Fri 7:30 AM–4:30 PM
          </p>
        </div>

        <a
          href="https://maps.google.com/?cid=12703290198424636798"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#17458F] hover:bg-[#1D5CB8] text-white font-montserrat font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center space-x-2 shrink-0 shadow-md"
        >
          <Navigation className="w-4 h-4 text-white" />
          <span>Get Directions</span>
        </a>
      </div>
      </div>
      </div>
    </div>
  );
};

