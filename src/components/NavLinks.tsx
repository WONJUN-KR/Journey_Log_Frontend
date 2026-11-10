"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath, pathWithoutLang, type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

// 상단 메뉴 - 지금 보고 있는 페이지 탭은 마우스를 올린 상태처럼 계속 강조
// 주소는 언어 앞부분 없는 형태로 두고, 그릴 때 언어 주소로(localizedPath) - 현재 탭 판단도 언어 앞부분을 뗀 주소로
const NAV_ITEMS = [
  { href: "/resume", label: "nav.resume", match: ["/resume"] },
  { href: "/projects", label: "nav.projects", match: ["/projects"] },
  { href: "/log", label: "nav.log", match: ["/log", "/series"] },
  { href: "/history", label: "nav.history", match: ["/history"] },
] as const;

export default function NavLinks({ lang }: { lang: Lang }) {
  const t = useTranslations();
  const pathname = pathWithoutLang(usePathname());

  return (
    <div className="flex items-center gap-0.5 max-[359px]:gap-0 sm:gap-1 text-[13px] max-[359px]:text-[12px] sm:text-sm font-medium text-accent-2">
      {NAV_ITEMS.map((item) => {
        const active = item.match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
        return (
          <Link
            key={item.href}
            href={localizedPath(lang, item.href)}
            aria-current={active ? "page" : undefined}
            className={`px-2 max-[359px]:px-1 sm:px-3 py-1.5 rounded-md transition-colors ${
              active ? "text-foreground bg-surface-hover" : "hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {t(item.label)}
          </Link>
        );
      })}
    </div>
  );
}
