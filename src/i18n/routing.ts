import { defineRouting } from "next-intl/routing";
import { DEFAULT_LANG, LANGS } from "./config";

// next-intl 라우팅 - 한국어는 주소 앞부분 없이(/projects) (as-needed: proxy 가 /projects 를 내부 /ko/projects 로 rewrite)
// localeDetection · localeCookie · alternateLinks 꺼 둠: 언어가 하나라 자동 이동 · hreflang 필요 없음
export const routing = defineRouting({
  locales: LANGS,
  defaultLocale: DEFAULT_LANG,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});
