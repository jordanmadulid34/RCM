import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Info, Search, X } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { COUNTRY_MAPPINGS, LOCALE_LABELS } from '../i18n/countryMapping';
import { CountryMapping, LocaleCode } from '../i18n/types';

interface CountrySelectorProps {
  isDark: boolean;
  isMobile?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ isDark, isMobile = false }) => {
  const { country, locale, selectCountry, selectLanguageForSingapore, isMachineTranslated } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [singaporeSubmenuOpen, setSingaporeSubmenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSingaporeSubmenuOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opening dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current && !isMobile) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, isMobile]);

  const handleCountryClick = (c: CountryMapping) => {
    if (c.id === 'SGP') {
      // Toggle Singapore language submenu
      setSingaporeSubmenuOpen((prev) => !prev);
      if (country.id !== 'SGP') {
        selectCountry('SGP');
      }
    } else {
      selectCountry(c.id);
      setIsOpen(false);
      setSingaporeSubmenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleSingaporeLangSelect = (code: LocaleCode) => {
    selectLanguageForSingapore(code);
    setIsOpen(false);
    setSingaporeSubmenuOpen(false);
    setSearchQuery('');
  };

  // Filter countries based on search term
  const filteredCountries = COUNTRY_MAPPINGS.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(query) ||
      (c.nativeName && c.nativeName.toLowerCase().includes(query)) ||
      c.id.toLowerCase().includes(query)
    );
  });

  if (isMobile) {
    return (
      <div className={`space-y-3 border-t pt-4 mt-4 ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`}>
        <div className={`flex items-center justify-between text-xs font-montserrat font-bold uppercase tracking-wider px-1 ${
          isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'
        }`}>
          <span className="flex items-center space-x-1.5">
            <Globe className={`w-4 h-4 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
            <span>Select Country / Region</span>
          </span>
          <span className={`text-[11px] font-normal lowercase ${isDark ? 'text-[#CBD5E1]' : 'text-[#4A5565]'}`}>
            ({country.flag} {country.name})
          </span>
        </div>

        {/* Mobile Search Input */}
        <div className="relative">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search country..."
            className={`w-full pl-8 pr-8 py-2 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 ${
              isDark
                ? 'bg-[#01142E] border-[#F7A81B]/30 text-[#F5F1E6] placeholder-[#94A3B8] focus:ring-[#F7A81B]/40'
                : 'bg-white border-[#D7D2C8] text-[#243447] placeholder-[#6B7280] focus:ring-[#17458F]/30'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-[#94A3B8] hover:text-[#F5F1E6]' : 'text-[#6B7280] hover:text-[#243447]'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1 max-h-64 overflow-y-auto">
          {filteredCountries.length === 0 ? (
            <div className={`col-span-2 py-4 text-center text-xs ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>
              No countries found
            </div>
          ) : (
            filteredCountries.map((c) => {
              const isSelected = country.id === c.id;
              return (
                <div key={c.id} className="relative">
                  <button
                    type="button"
                    onClick={() => handleCountryClick(c)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
                      isSelected
                        ? isDark
                          ? 'bg-[#F7A81B]/20 border-[#F7A81B] text-[#F7A81B] font-bold'
                          : 'bg-[#E8F1FC] border-[#17458F]/30 text-[#17458F] font-bold shadow-xs'
                        : isDark
                        ? 'bg-[#01142E] border-white/10 text-[#F5F1E6] hover:bg-white/10'
                        : 'bg-[#F2EFE8] border-[#D7D2C8]/60 text-[#243447] hover:bg-[#EAE6DD]'
                    }`}
                  >
                    <span className="flex items-center space-x-1.5 truncate">
                      <span className="text-base leading-none shrink-0">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    {isSelected && (
                      <Check className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'}`} />
                    )}
                  </button>

                  {/* Singapore mobile submenu */}
                  {c.id === 'SGP' && singaporeSubmenuOpen && (
                    <div className={`col-span-2 mt-1 space-y-1 p-2 rounded-xl border ${
                      isDark
                        ? 'bg-[#01142E] border-[#F7A81B]/30 text-[#F5F1E6]'
                        : 'bg-[#EAE6DD] border-[#17458F]/20 text-[#243447]'
                    }`}>
                      <div className={`text-[11px] font-bold mb-1 ${isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'}`}>
                        Singapore Languages:
                      </div>
                      {c.availableLanguages?.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSingaporeLangSelect(lang.code)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                            locale === lang.code
                              ? isDark
                                ? 'bg-[#F7A81B] text-[#01142E] font-bold'
                                : 'bg-[#17458F] text-white font-bold'
                              : isDark
                              ? 'hover:bg-white/10 text-[#F5F1E6]'
                              : 'hover:bg-[#DCD6C9] text-[#243447]'
                          }`}
                        >
                          <span>{lang.name} ({lang.nativeName})</span>
                          {locale === lang.code && (
                            <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#01142E]' : 'text-white'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (isOpen) {
            setSearchQuery('');
            setSingaporeSubmenuOpen(false);
          }
        }}
        className={`px-3.5 py-1.5 rounded-full text-xs font-montserrat font-bold transition-all flex items-center space-x-2 border shadow-xs cursor-pointer ${
          isDark
            ? 'border-[#F7A81B]/30 bg-[#011E41] text-[#F5F1E6] hover:bg-[#01142E] hover:border-[#F7A81B]'
            : 'border-[#243447]/15 bg-[#F2EFE8] text-[#243447] hover:bg-white'
        }`}
        title="Select Country to set language"
        aria-label="Select Country and Language"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{country.flag}</span>
        <span className="font-semibold">{country.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
          isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'
        } ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border p-3 z-50 transition-all ${
            isDark
              ? 'bg-[#011E41] border-[#F7A81B]/30 text-[#F5F1E6]'
              : 'bg-[#F4F1EA] border-[#D7D2C8] text-[#243447]'
          }`}
        >
          {/* Header & Language Info */}
          <div className={`pb-2.5 mb-2.5 border-b flex items-center justify-between px-1 ${
            isDark ? 'border-white/10' : 'border-[#243447]/10'
          }`}>
            <div className={`text-[11px] font-montserrat font-bold uppercase tracking-wider flex items-center space-x-1.5 ${
              isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'
            }`}>
              <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-[#F7A81B]' : 'text-[#C9982B]'}`} />
              <span>Select Country</span>
            </div>
            <div className={`text-[11px] font-sans font-medium ${isDark ? 'text-[#CBD5E1]' : 'text-[#4A5565]'}`}>
              Language: <span className={`font-semibold ${isDark ? 'text-[#F7A81B]' : 'text-[#243447]'}`}>{LOCALE_LABELS[locale] || 'English'}</span>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative mb-2.5">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
              isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'
            }`} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country..."
              className={`w-full pl-8 pr-8 py-2 rounded-xl text-xs font-sans border focus:outline-none focus:ring-2 shadow-2xs ${
                isDark
                  ? 'bg-[#01142E] border-[#F7A81B]/30 text-[#F5F1E6] placeholder-[#94A3B8] focus:ring-[#F7A81B]/40'
                  : 'bg-white border-[#D7D2C8] text-[#243447] placeholder-[#6B7280] focus:ring-[#17458F]/30'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer ${
                  isDark ? 'text-[#94A3B8] hover:text-[#F5F1E6]' : 'text-[#6B7280] hover:text-[#243447]'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Country List */}
          <div className="max-h-80 overflow-y-auto space-y-1 pr-0.5">
            {filteredCountries.length === 0 ? (
              <div className={`py-6 text-center text-xs font-sans ${isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'}`}>
                No matching countries found
              </div>
            ) : (
              filteredCountries.map((c, index) => {
                const isSelected = country.id === c.id;
                const isSingapore = c.id === 'SGP';
                // Show divider after the 4th item if not searching
                const showDividerAfter = !searchQuery && index === 3;

                return (
                  <React.Fragment key={c.id}>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleCountryClick(c)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-[#F7A81B]/20 border border-[#F7A81B]/50 text-[#F7A81B] font-bold shadow-2xs'
                              : 'bg-[#E8F1FC] border border-[#17458F]/25 text-[#17458F] font-bold shadow-2xs'
                            : isDark
                            ? 'hover:bg-white/10 text-[#F5F1E6]'
                            : 'hover:bg-[#EAE6DD] text-[#243447]'
                        }`}
                      >
                        <span className="flex items-center space-x-2.5">
                          <span className="text-base leading-none shrink-0">{c.flag}</span>
                          <span className={`font-sans font-medium ${isDark ? 'text-[#F5F1E6]' : 'text-[#243447]'}`}>{c.name}</span>
                          {c.nativeName && c.nativeName !== c.name && (
                            <span className={`text-[10px] font-normal truncate max-w-[90px] ${
                              isDark ? 'text-[#94A3B8]' : 'text-[#6B7280]'
                            }`}>
                              ({c.nativeName})
                            </span>
                          )}
                        </span>

                        <span className="flex items-center space-x-1 shrink-0">
                          {isSingapore && (
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'
                              } ${singaporeSubmenuOpen ? 'rotate-180' : ''}`}
                            />
                          )}
                          {isSelected && (
                            <Check className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'}`} />
                          )}
                        </span>
                      </button>

                      {/* Singapore languages submenu dropdown */}
                      {isSingapore && singaporeSubmenuOpen && (
                        <div className={`ml-5 my-1.5 pl-3 border-l-2 space-y-1 py-1.5 rounded-r-xl ${
                          isDark
                            ? 'border-[#F7A81B]/40 bg-[#01142E]/80'
                            : 'border-[#17458F]/30 bg-[#EAE6DD]/70'
                        }`}>
                          <div className={`text-[10px] font-bold px-2 uppercase tracking-wider ${
                            isDark ? 'text-[#F7A81B]' : 'text-[#17458F]'
                          }`}>
                            Choose Language:
                          </div>
                          {c.availableLanguages?.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => handleSingaporeLangSelect(lang.code)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                locale === lang.code
                                  ? isDark
                                    ? 'bg-[#F7A81B] text-[#01142E] font-bold shadow-2xs'
                                    : 'bg-[#17458F] text-white font-bold shadow-2xs'
                                  : isDark
                                  ? 'hover:bg-white/10 text-[#F5F1E6]'
                                  : 'hover:bg-[#DCD6C9] text-[#243447]'
                              }`}
                            >
                              <span>{lang.name} <span className="opacity-80">({lang.nativeName})</span></span>
                              {locale === lang.code && (
                                <Check className={`w-3.5 h-3.5 ${isDark ? 'text-[#01142E]' : 'text-white'}`} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {showDividerAfter && (
                      <div className={`my-1.5 border-b ${isDark ? 'border-white/10' : 'border-[#243447]/10'}`} />
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>

          {/* Translation Disclaimer if machine translated */}
          {isMachineTranslated && (
            <div className={`mt-2.5 p-2 rounded-xl border text-[10px] flex items-start space-x-1.5 ${
              isDark
                ? 'bg-[#F7A81B]/15 border-[#F7A81B]/30 text-[#F7A81B]'
                : 'bg-[#E8F1FC] border-[#17458F]/20 text-[#17458F]'
            }`}>
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>AI-assisted translation active. Native speaker review in progress.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

