// 언어 설정 - 한국어 한 가지. 예전 영어 주소(/en/...)는 next.config.ts 에서 한국어 주소로 보냄
export const LANGS = ["ko"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ko";

// 날짜 형식(Intl) · 링크 미리보기(og:locale) 언어 코드
export const DATE_LOCALE: Record<Lang, string> = { ko: "ko-KR" };
export const OG_LOCALE: Record<Lang, string> = { ko: "ko_KR" };

// 한국어는 주소 앞부분 없이 "/projects"
export function localizedPath(lang: Lang, path: string): string {
  if (lang === DEFAULT_LANG) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

// "/ko/projects" → "/projects" (언어 앞부분을 뗀 같은 페이지 주소) - proxy 가 /projects 를 내부 /ko/projects 로 바꿔 그리므로 어느 쪽이 와도 같은 결과
export function pathWithoutLang(pathname: string): string {
  for (const lang of LANGS) {
    if (pathname === `/${lang}`) return "/";
    if (pathname.startsWith(`/${lang}/`)) return pathname.slice(lang.length + 1);
  }
  return pathname;
}

export function langFromPath(pathname: string): Lang {
  return LANGS.find((lang) => lang !== DEFAULT_LANG && (pathname === `/${lang}` || pathname.startsWith(`/${lang}/`))) ?? DEFAULT_LANG;
}
