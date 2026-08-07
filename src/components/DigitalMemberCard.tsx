import React, { useState } from 'react';
import { Shield, QrCode, Download, Check, Sparkles, User, Award, Calendar } from 'lucide-react';
import { MemberProfile } from '../data/rcmMemberData';
import { RotaryWheelSVG } from './RCMLogo';

interface DigitalMemberCardProps {
  member: MemberProfile;
  isDark: boolean;
}

export const DigitalMemberCard: React.FC<DigitalMemberCardProps> = ({ member, isDark }) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Card Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#F8FAFC]">
            Official Digital Membership Card
          </h3>
          <p className="text-xs font-sans opacity-80 mt-1 text-[#CBD5E1]">
            Present this card at club weekly meetings, district conferences, and inter-club fellowship events.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center space-x-2 bg-[#F7A81B] hover:bg-[#D98E0E] text-[#0F172A] font-montserrat font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-[#011E41]" />
              <span>Card Saved to Wallet</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Digital Pass</span>
            </>
          )}
        </button>
      </div>

      {/* The Digital Card Container */}
      <div className="max-w-md mx-auto w-full relative group">
        {/* Glow halo behind card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#F7A81B]/40 via-[#011E41]/30 to-[#F7A81B]/40 blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Card Body */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#011E41] via-[#022A5C] to-[#01142E] text-[#F5F1E6] p-6 sm:p-7 border-2 border-[#F7A81B]/60 shadow-2xl space-y-6">
          {/* Top Header of Card */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F7A81B]/30">
            <div className="flex items-center space-x-3">
              <RotaryWheelSVG className="h-10 w-auto drop-shadow-md" />
              <div>
                <h4 className="font-serif font-bold text-base text-[#F7A81B] leading-tight">
                  Rotary Club of Makati
                </h4>
                <p className="text-[10px] font-montserrat uppercase tracking-wider text-[#F5F1E6]/80">
                  District 3830 • Est. 1966
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-[#F7A81B] text-[#011E41] text-[9px] font-montserrat font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                {member.status}
              </span>
            </div>
          </div>

          {/* Middle: Member Details & Avatar */}
          <div className="flex items-center space-x-5">
            {/* Initials Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#011E41] to-[#033E78] border-2 border-[#F7A81B] flex items-center justify-center text-[#F7A81B] font-serif font-bold text-2xl shadow-inner">
                {member.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-[#F7A81B] p-1 rounded-full text-[#011E41]">
                <Shield className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white truncate">
                {member.name}
              </h3>
              <p className="text-xs font-sans text-[#F7A81B] font-medium truncate">
                {member.classification}
              </p>
              <p className="text-[11px] font-sans text-[#F5F1E6]/70 truncate">
                {member.company}
              </p>
            </div>
          </div>

          {/* Bottom Grid: IDs & QR Graphic */}
          <div className="grid grid-cols-12 gap-4 pt-3 border-t border-[#F7A81B]/20 items-end">
            <div className="col-span-8 space-y-2">
              <div>
                <span className="text-[9px] font-montserrat uppercase tracking-widest text-[#F5F1E6]/60 block">
                  Member ID Number
                </span>
                <span className="font-mono text-sm font-bold text-[#F7A81B] tracking-wider">
                  {member.rotaryId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-[#F5F1E6]/60 block uppercase font-montserrat text-[8px] tracking-wider">
                    Member Since
                  </span>
                  <span className="font-semibold text-white">{member.joinYear}</span>
                </div>
                <div>
                  <span className="text-[#F5F1E6]/60 block uppercase font-montserrat text-[8px] tracking-wider">
                    Role
                  </span>
                  <span className="font-semibold text-[#F7A81B]">{member.role}</span>
                </div>
              </div>
            </div>

            {/* QR Code Graphic (Visual) */}
            <div className="col-span-4 flex flex-col items-center justify-end">
              <div className="bg-white p-2 rounded-xl shadow-md border border-[#F7A81B]/50">
                {/* SVG Mock QR Pattern */}
                <svg viewBox="0 0 100 100" className="w-16 h-16" fill="#011E41">
                  <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10z" />
                  <rect x="40" y="10" width="10" height="20" />
                  <rect x="55" y="5" width="10" height="15" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="40" width="25" height="10" />
                  <rect x="10" y="40" width="15" height="10" />
                  <rect x="70" y="70" width="15" height="25" />
                  <rect x="40" y="70" width="15" height="10" />
                  <rect x="55" y="85" width="10" height="10" />
                </svg>
              </div>
              <span className="text-[8px] font-mono text-[#F5F1E6]/60 uppercase tracking-widest mt-1">
                SCAN AT ENTRY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
