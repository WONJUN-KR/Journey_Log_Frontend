import type { Metadata } from "next";
import { OG_ALT, OG_SIZE } from "@/lib/ogImage";
import { DEFAULT_LANG, OG_LOCALE, localizedPath, type Lang } from "@/i18n";
import { tFor } from "@/i18n/translator";

// 링크 미리보기 이미지 등 절대 주소의 기준 - 도메인 바꾸면 여기만 수정
export const SITE_URL = "https://wonjun.page";
export const SITE_NAME = "오원준 포트폴리오";
// 메신저 링크 미리보기의 회색 한 줄 - 짧게 유지
export const SITE_DESCRIPTION = "의료 IT 풀스택 개발자";

// openGraph 는 레이아웃과 얕게 병합돼서 페이지가 openGraph 를 쓰면 레이아웃 값(파일 기반 og 이미지 포함)이 통째로 사라짐
// → 공통 필드와 미리보기 이미지(app/opengraph-image.tsx)를 여기서 같이 넣음
// 이미지 주소에 버전을 붙임 - 카톡 등은 이미지를 주소 기준으로 오래 저장해서, 그림을 바꾸면 이 값을 올려야 새 그림을 다시 받음
const OG_VERSION = 3;
const ogImage = (lang: Lang) => ({ url: `/opengraph-image?v=${OG_VERSION}`, ...OG_SIZE, alt: OG_ALT[lang] });

// 페이지별 제목·설명·주소를 description · og · twitter 에 똑같이 반영
// path 는 언어 앞부분 없는 주소("/projects") - canonical 은 그 주소
export function pageMetadata({ title, description, path, lang = DEFAULT_LANG }: { title?: string; description: string; path: string; lang?: Lang }): Metadata {
  const t = tFor(lang);
  const siteName = t("site.name");
  const fullTitle = title ? `${title} · ${siteName}` : siteName;
  const url = localizedPath(lang, path);
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName, locale: OG_LOCALE[lang], images: [ogImage(lang)], title: fullTitle, description, url },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage(lang)] },
  };
}
