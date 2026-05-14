import { writable, derived } from 'svelte/store';
import { translations, type Language, type TranslationKey } from '$lib/i18n/translations';

// App screen state
export type Screen = 'landing' | 'input' | 'loading' | 'output' | 'crisis';
export const currentScreen = writable<Screen>('landing');

// User selections (lost on refresh — by design)
export type Audience = 'medical' | 'family' | 'work';
export const selectedAudience = writable<Audience | null>(null);

// Raw user input (cleared after translation — by design)
export const rawInput = writable<string>('');

// Translated output
export const translatedOptions = writable<string[]>([]);

// Error state
export const errorState = writable<'none' | 'network' | 'translation_failed'>('none');

// Localization
export const currentLanguage = writable<Language>('en');
export const t = derived(
  currentLanguage,
  ($lang) => (key: TranslationKey) => translations[$lang][key] || key
);
