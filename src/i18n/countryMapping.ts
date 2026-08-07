import { CountryMapping } from './types';

export const COUNTRY_MAPPINGS: CountryMapping[] = [
  {
    id: 'PHL',
    name: 'Philippines',
    nativeName: 'Pilipinas',
    flag: '🇵🇭',
    defaultLocale: 'fil',
  },
  {
    id: 'SGP',
    name: 'Singapore',
    nativeName: 'Singapore',
    flag: '🇸🇬',
    defaultLocale: 'en',
    availableLanguages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (简体)' },
      { code: 'ms', name: 'Bahasa Melayu', nativeName: 'Bahasa Melayu' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    ],
  },
  {
    id: 'MYS',
    name: 'Malaysia',
    nativeName: 'Malaysia',
    flag: '🇲🇾',
    defaultLocale: 'ms',
  },
  {
    id: 'IDN',
    name: 'Indonesia',
    nativeName: 'Indonesia',
    flag: '🇮🇩',
    defaultLocale: 'id',
  },
  {
    id: 'THA',
    name: 'Thailand',
    nativeName: 'ประเทศไทย',
    flag: '🇹🇭',
    defaultLocale: 'th',
  },
  {
    id: 'VNM',
    name: 'Vietnam',
    nativeName: 'Việt Nam',
    flag: '🇻🇳',
    defaultLocale: 'vi',
  },
  {
    id: 'BRU',
    name: 'Brunei',
    nativeName: 'Brunei Darussalam',
    flag: '🇧🇳',
    defaultLocale: 'ms',
  },
  {
    id: 'KHM',
    name: 'Cambodia',
    nativeName: 'កម្ពុជា',
    flag: '🇰🇭',
    defaultLocale: 'km',
  },
  {
    id: 'LAO',
    name: 'Laos',
    nativeName: 'ລາວ',
    flag: '🇱🇦',
    defaultLocale: 'lo',
  },
  {
    id: 'MMR',
    name: 'Myanmar',
    nativeName: 'မြန်မာ',
    flag: '🇲🇲',
    defaultLocale: 'my',
  },
  {
    id: 'TLS',
    name: 'East Timor',
    nativeName: 'Timor-Leste',
    flag: '🇹🇱',
    defaultLocale: 'tet',
  },
  {
    id: 'INT',
    name: 'Other / International',
    nativeName: 'International',
    flag: '🌐',
    defaultLocale: 'en',
  },
];

export const DEFAULT_COUNTRY = COUNTRY_MAPPINGS.find((c) => c.id === 'INT') || COUNTRY_MAPPINGS[0];
export const DEFAULT_LOCALE = 'en';

export const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  fil: 'Filipino / Tagalog',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  th: 'Thai (ไทย)',
  vi: 'Vietnamese (Tiếng Việt)',
  km: 'Khmer (ភាសាខ្មែរ)',
  lo: 'Lao (ພາສາລາວ)',
  my: 'Burmese (မြန်မာဘာသာ)',
  zh: 'Mandarin Chinese (中文)',
  ta: 'Tamil (தமிழ்)',
  tet: 'Tetum (Lian Tetun)',
  pt: 'Portuguese (Português)',
};

// Voice synthesis support configuration per language
export const VOICE_SUPPORT_MAP: Record<string, { voiceSupported: boolean; langCode: string }> = {
  en: { voiceSupported: true, langCode: 'en-US' },
  fil: { voiceSupported: true, langCode: 'fil-PH' },
  id: { voiceSupported: true, langCode: 'id-ID' },
  ms: { voiceSupported: true, langCode: 'ms-MY' },
  th: { voiceSupported: true, langCode: 'th-TH' },
  vi: { voiceSupported: true, langCode: 'vi-VN' },
  zh: { voiceSupported: true, langCode: 'zh-CN' },
  ta: { voiceSupported: true, langCode: 'ta-IN' },
  pt: { voiceSupported: true, langCode: 'pt-PT' },
  km: { voiceSupported: false, langCode: 'km-KH' },
  lo: { voiceSupported: false, langCode: 'lo-LA' },
  my: { voiceSupported: false, langCode: 'my-MM' },
  tet: { voiceSupported: false, langCode: 'tet-TL' },
};
