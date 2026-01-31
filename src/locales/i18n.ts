import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

export type Locale = "ar" | "en";

type Dict = Record<string, string>;

const dictionaries: Record<Locale, Dict> = {
  ar: ar as Dict,
  en: en as Dict,
};

export function t(locale: Locale, key: string) {
  const dict = dictionaries[locale] ?? dictionaries.en;
  return dict[key] ?? key;
}
