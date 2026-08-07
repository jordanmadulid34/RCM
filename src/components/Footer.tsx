import React from 'react';
import { MapPin, Phone, Mail, Facebook, Youtube, Video, ExternalLink } from 'lucide-react';
import { TabType, ThemeType } from '../types';
import { RCM_INFO, RCM_IMAGES } from '../data/rcmData';
import { ImageWithFallback } from './ImageWithFallback';
import { RCMLogo } from './RCMLogo';
import { useI18n } from '../i18n/I18nContext';

interface FooterProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  theme,
}) => {
  const { t } = useI18n();

  const tabs: TabType[] = [
    'Home',
    'About Us',
    'Board of Directors',
    'Roster of Presidents',
    'Partnerships',
    'Projects',
    'News',
    'Membership',
    'Contact Us',
    'Admin',
  ];
  const isDark = theme === 'dark';

  const getTabLabel = (tab: TabType): string => {
    switch (tab) {
      case 'Home': return t('nav.home');
      case 'About Us': return t('nav.about');
      case 'Projects': return t('nav.projects');
      case 'News': return t('nav.news');
      case 'Membership': return t('nav.membership');
      case 'Contact Us': return t('nav.contact');
      case 'Board of Directors': return t('nav.leadership');
      case 'Roster of Presidents': return t('nav.presidents');
      case 'Partnerships': return t('nav.sisterClubs');
      case 'Admin': return t('nav.adminDashboard');
      default: return tab;
    }
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="border-t border-[#243447]/10 transition-colors duration-300 bg-[#CFC6B7] text-[#4A5565]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Badge */}
          <div className="lg:col-span-4 space-y-5">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleTabClick('Home')}
            >
              <RCMLogo theme="light" size="lg" />
            </div>

            <p className="text-sm font-sans text-[#4A5565] leading-relaxed font-normal">
              Chartered March 12, 1966 at the Manila Polo Club, Forbes Park. The premier Rotary club of Makati dedicated to community transformation.
            </p>

            {/* Gold Motto */}
            <div className="pt-2">
              <span className="font-serif italic text-lg font-bold text-[#C9982B] block">
                "{RCM_INFO.motto}"
              </span>
            </div>

            {/* District 3830 Badge */}
            <div className="pt-2 flex items-center space-x-3">
              <div className="w-32 h-16 bg-[#F2EFE8] rounded-lg border border-[#C9982B]/30 p-1.5 flex items-center justify-center shadow-xs">
                <ImageWithFallback
                  src={RCM_IMAGES.districtBadge}
                  alt="Rotary District 3830 Badge"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs font-montserrat font-semibold text-[#243447] uppercase tracking-wider">
                Rotary International <br /> District 3830
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Functional) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-widest text-[#17458F] border-b border-[#243447]/10 pb-2">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2.5">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className="text-sm font-montserrat uppercase text-[#4A5565] hover:text-[#17458F] transition-colors cursor-pointer flex items-center space-x-2"
                  >
                    <span className="text-[#C9982B] text-xs">›</span>
                    <span>{getTabLabel(tab)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Details & Office */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-montserrat font-bold text-xs uppercase tracking-widest text-[#17458F] border-b border-[#243447]/10 pb-2">
              {t('footer.officeSecretariat')}
            </h4>

            <div className="space-y-3 text-sm font-sans text-[#4A5565]">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#C9982B] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#243447]">{RCM_INFO.office.building}</strong><br />
                  {RCM_INFO.office.address}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#C9982B] shrink-0" />
                <span>{RCM_INFO.office.phone}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#C9982B] shrink-0" />
                <span>{RCM_INFO.office.email}</span>
              </div>
            </div>

            {/* Official Social Channels */}
            <div className="pt-3 space-y-2">
              <h5 className="text-xs font-montserrat uppercase font-bold text-[#17458F] tracking-wider">
                {t('footer.officialSocials')}
              </h5>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={RCM_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rotary Club of Makati Facebook"
                  className="px-3 py-2 rounded-xl bg-[#F2EFE8] text-[#243447] hover:text-[#FFFFFF] hover:bg-[#17458F] transition-all border border-[#C9982B]/30 flex items-center space-x-2 text-xs font-montserrat font-bold shadow-xs cursor-pointer group"
                >
                  <Facebook className="w-4 h-4 text-[#17458F] group-hover:text-[#FFFFFF] transition-colors" />
                  <span>Facebook</span>
                </a>

                <a
                  href={RCM_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rotary Club of Makati YouTube"
                  className="px-3 py-2 rounded-xl bg-[#F2EFE8] text-[#243447] hover:text-[#FFFFFF] hover:bg-[#17458F] transition-all border border-[#C9982B]/30 flex items-center space-x-2 text-xs font-montserrat font-bold shadow-xs cursor-pointer group"
                >
                  <Youtube className="w-4 h-4 text-[#FF0000] group-hover:text-[#FFFFFF] transition-colors" />
                  <span>YouTube</span>
                </a>

                <a
                  href={RCM_INFO.socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rotary Club of Makati TikTok"
                  className="px-3 py-2 rounded-xl bg-[#F2EFE8] text-[#243447] hover:text-[#FFFFFF] hover:bg-[#17458F] transition-all border border-[#C9982B]/30 flex items-center space-x-2 text-xs font-montserrat font-bold shadow-xs cursor-pointer group"
                >
                  <svg className="w-4 h-4 fill-current text-[#17458F] group-hover:text-[#FFFFFF] transition-colors" viewBox="0 0 24 24">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.812c-1.611 0-2.903-1.304-2.903-2.903 0-1.6 1.3-2.903 2.903-2.903.35 0 .684.062 1.002.175V9.227a6.29 6.29 0 0 0-1.002-.08C6.012 9.147 3 12.16 3 15.683 3 19.205 6.012 22 9.473 22c3.46 0 6.472-2.795 6.472-6.317V9.008a8.196 8.196 0 0 0 4.644 1.442v-3.44c-.334 0-.663-.08-.998-.324z"/>
                  </svg>
                  <span>TikTok</span>
                </a>

                <a
                  href="https://www.rotaryclubmakati.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#17458F] hover:underline flex items-center space-x-1 font-montserrat ml-1 py-1 font-bold"
                >
                  <span>rotaryclubmakati.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="mt-12 pt-8 border-t border-[#243447]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] font-sans gap-4">
          <p>© 1966 – 2026 Rotary Club of Makati. All Rights Reserved.</p>
          <p className="font-montserrat uppercase tracking-wider text-[11px] text-[#C9982B] font-bold">
            District 3830 • Mother Club of Makati
          </p>
        </div>
      </div>
    </footer>
  );
};
