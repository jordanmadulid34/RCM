import { COUNTRY_MAPPINGS, DEFAULT_COUNTRY, DEFAULT_LOCALE } from './countryMapping';
import { CountryMapping, LocaleCode } from './types';

const COUNTRY_COOKIE = 'rcm_country';
const LOCALE_COOKIE = 'rcm_locale';
const COOKIE_DAYS = 365;

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

export function setCookie(name: string, value: string, days = COOKIE_DAYS): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getSavedCountryAndLocale(): { country: CountryMapping; locale: LocaleCode } {
  const savedCountryId = getCookie(COUNTRY_COOKIE);
  const savedLocale = getCookie(LOCALE_COOKIE) as LocaleCode | null;

  if (!savedCountryId) {
    // Default requirement: First-time visitors MUST see English & International default
    return {
      country: DEFAULT_COUNTRY,
      locale: DEFAULT_LOCALE,
    };
  }

  const country = COUNTRY_MAPPINGS.find((c) => c.id === savedCountryId) || DEFAULT_COUNTRY;
  
  // If a valid locale was saved, use it. Otherwise use country default.
  let locale: LocaleCode = savedLocale || country.defaultLocale;

  return { country, locale };
}

export function saveCountrySelection(country: CountryMapping, locale?: LocaleCode): void {
  const targetLocale = locale || country.defaultLocale;
  setCookie(COUNTRY_COOKIE, country.id);
  setCookie(LOCALE_COOKIE, targetLocale);
}
