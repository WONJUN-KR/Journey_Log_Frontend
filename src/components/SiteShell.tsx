import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import NavLinks from "@/components/NavLinks";
import "@/app/globals.css";
import { SITE_URL, pageMetadata } from "@/lib/seo";
import { localizedPath, type Lang } from "@/i18n";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebFontLoader from "@/components/WebFontLoader";
import MoreToggleScrollRestore from "@/components/MoreToggleScrollRestore";
import { NextIntlClientProvider, useMessages, useTranslations } from "next-intl";
import { tFor } from "@/i18n/translator";
import { yearIn } from "@/lib/time";

// 언어별 루트 레이아웃(app/[locale])의 홈 기준 메타데이터 - 다른 페이지는 각 page.tsx 에서 pageMetadata 로 설명·주소를 덮어씀
export function rootMetadata(lang: Lang): Metadata {
  const t = tFor(lang);
  const siteName = t("site.name");
  return {
    ...pageMetadata({ description: t("site.description"), path: "/", lang }),
    metadataBase: new URL(SITE_URL),
    // 페이지별 제목은 "연혁 · 오원준 포트폴리오" 처럼 뒤에 사이트 이름이 붙음
    title: { default: siteName, template: `%s · ${siteName}` },
  };
}

// 사이트 공통 틀 - <html> 부터 헤더 · 푸터 · 분석 도구까지
// 클라이언트 컴포넌트가 useTranslations 로 쓰는 메시지 묶음 - 새 클라이언트 컴포넌트에서 다른 묶음을 쓰면 여기에 추가
// (빠지면 화면에 키 이름이 그대로 나오고 콘솔에 MISSING_MESSAGE)
const CLIENT_NAMESPACES = ["nav", "contrib", "log", "series", "gallery", "toggle"] as const;

export default function SiteShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const messages = useMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
  const t = useTranslations();
  return (
    <html lang={lang} className="h-full">
      <body className="min-h-full flex flex-col font-sans">
        {/* 클라이언트 컴포넌트(메뉴 · 잔디 · 기록 등)의 useTranslations 용 - 쓰는 묶음만 넘김 (전부 넘기면 페이지마다 HTML 약 5KB 증가) */}
        <NextIntlClientProvider messages={clientMessages}>
        <header className="sticky top-0 z-40 border-b border-line bg-background">
          <nav className="max-w-5xl mx-auto flex items-center justify-between gap-3 max-[359px]:gap-2 px-4 max-[359px]:px-3 sm:px-6 h-14">
            {/* 휴대폰 폭에선 메뉴가 한 줄에 들어가도록 로고를 줄임. 360px 미만(가장 작은 폰 320px)은 여백·글자를 한 단계 더 줄임 */}
            <Link href={localizedPath(lang, "/")} className="-ml-2 shrink-0 whitespace-nowrap rounded-md px-2 py-1.5 max-[359px]:text-[15px] font-medium transition-colors hover:bg-surface-hover">
              Wonjun<span className="hidden sm:inline">{t("nav.logoSuffix")}</span>
            </Link>
            <NavLinks lang={lang} />
          </nav>
        </header>
        <main className="relative flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* 언어 전환 국기 - 본문 위 여백(py-8) 안 오른쪽에 겹쳐 둬서 본문 위치는 그대로 */}
          <div className="absolute right-4 sm:right-6 top-2 sm:top-3">
          </div>
          {children}
        </main>
        {/* 저작권 - 모든 페이지 하단 */}
        <footer className="max-w-5xl w-full mx-auto px-4 sm:px-6 pb-8 text-center text-xs text-muted print:hidden">© {yearIn()} WonJun. All rights reserved.</footer>
        {/* 방문 통계 (Vercel Web Analytics) - 쿠키 없이 페이지뷰·유입 경로·기기만 집계, Vercel 배포에서만 수집 */}
        <Analytics />
        {/* 웹폰트(페이퍼로지 · Pretendard)는 첫 페인트 뒤에 등록 */}
        <WebFontLoader />
        {/* 휴대폰 접기 버튼: 접으면 펼쳤던 화면 위치로 */}
        <MoreToggleScrollRestore />
        </NextIntlClientProvider>
      </body>
      {/* 방문 통계 (Google Analytics 4) - 체류 시간 · 스크롤 · 클릭까지. 페이지 로드가 끝난 뒤 받아서 첫 화면엔 영향 없음
          운영 배포에서만 넣음 - 로컬 · 미리보기 방문이 통계에 섞이지 않게 */}
      {process.env.VERCEL_ENV === "production" && <GoogleAnalytics />}
    </html>
  );
}
