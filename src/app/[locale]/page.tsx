import { setRequestLocale } from "next-intl/server";
import HomeView from "@/components/HomeView";
import { getAbout } from "@/lib/about";
import type { Lang } from "@/i18n";

type Props = { params: Promise<{ locale: Lang }> };

// ?year= 는 읽지 않음 - 연도 전환은 잔디 컴포넌트가 브라우저에서 /api/contributions 로 처리 → 홈을 정적(ISR) 페이지로
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeView about={getAbout()} lang={locale} />;
}
