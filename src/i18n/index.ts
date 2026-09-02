import { en } from './en';
import { hi } from './hi';
import { or } from './or';

export type LanguageCode = 'en' | 'hi' | 'or';
export type TranslationKey = string; // In production, we can strongly type this

const translations: Record<LanguageCode, any> = { en, hi, or };

export const t = (key: TranslationKey, lang: LanguageCode = 'en'): string => {
  const keys = key.split('.');
  let current = translations[lang] || translations['en'];

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    current = current[k];
  }

  return current as string;
};
