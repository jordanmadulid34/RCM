export type LocaleCode =
  | 'en'
  | 'fil'
  | 'id'
  | 'ms'
  | 'th'
  | 'vi'
  | 'km'
  | 'lo'
  | 'my'
  | 'zh'
  | 'ta'
  | 'tet'
  | 'pt';

export type CountryCode =
  | 'BRU'
  | 'KHM'
  | 'TLS'
  | 'IDN'
  | 'LAO'
  | 'MYS'
  | 'MMR'
  | 'PHL'
  | 'SGP'
  | 'THA'
  | 'VNM'
  | 'INT';

export interface LanguageOption {
  code: LocaleCode;
  name: string;
  nativeName: string;
}

export interface CountryMapping {
  id: CountryCode;
  name: string;
  nativeName: string;
  flag: string;
  defaultLocale: LocaleCode;
  availableLanguages?: LanguageOption[];
}

export interface I18nState {
  country: CountryMapping;
  locale: LocaleCode;
  languageName: string;
  isMachineTranslated: boolean;
}
