import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import { tFor } from "@/i18n/translator";
import type { Lang } from "@/i18n";
import AboutView from "@/components/AboutView";
import { getAbout } from "@/lib/about";

type Props = { params: Promise<{ locale: Lang }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = tFor(locale);
  return pageMetadata({ title: t("meta.resume.title"), description: t("meta.resume.description"), path: "/resume", lang: locale });
}

// 경력 기간이 오늘(사이트 기준 시간대) 날짜로 계산되므로 1시간마다 다시 그림 - 매월 1일 KST 0시가 지나면 1시간 안에 개월 수가 바뀜 (홈도 잔디 캐시로 1시간)
export const revalidate = 3600;

export default async function ResumePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutView about={getAbout()} lang={locale} />;
}
