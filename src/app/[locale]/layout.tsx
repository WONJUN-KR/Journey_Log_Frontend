import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import SiteShell, { rootMetadata } from "@/components/SiteShell";
import { routing } from "@/i18n/routing";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

// 루트 레이아웃 - 한국어 /(주소 그대로), 빌드 때 정적으로 미리 만듦
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? rootMetadata(locale) : {};
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // 정적 렌더링 - 요청 헤더 대신 이 값으로 언어를 정함 (레이아웃 · 페이지마다 호출)
  setRequestLocale(locale);
  return <SiteShell lang={locale}>{children}</SiteShell>;
}
