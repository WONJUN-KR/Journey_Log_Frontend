import { createTranslator } from "next-intl";
import { DEFAULT_TIME_ZONE } from "@/lib/time";
import type { Lang } from "./config";
import { MESSAGES } from "./messages";

// 컴포넌트 밖(메타데이터 · sitemap 등)에서 쓰는 번역 함수 - 컴포넌트 안은 useTranslations / getTranslations
// 언어를 직접 넘기므로 요청 정보 없이 빌드 때도 동작. 사용: tFor("ko")("meta.resume.title")
export function tFor(lang: Lang) {
  return createTranslator({ locale: lang, messages: MESSAGES[lang], timeZone: DEFAULT_TIME_ZONE });
}
