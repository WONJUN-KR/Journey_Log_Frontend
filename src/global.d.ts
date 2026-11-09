import type { Lang } from "@/i18n/config";
import type { ko } from "@/i18n/locales/ko";

// next-intl 타입 - t("키") 의 키 자동완성 · 오타 검사, 언어 값은 "ko"
declare module "next-intl" {
  interface AppConfig {
    Locale: Lang;
    Messages: typeof ko;
  }
}
