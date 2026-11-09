import Link from "next/link";
import { localizedPath, type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

// 404 본문 - 언어별 루트 레이아웃 안(not-found.tsx)과 전역 404(global-not-found.tsx)가 같이 씀
export default function NotFoundView({ lang }: { lang: Lang }) {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-start gap-4 py-24">
      <p className="text-sm font-semibold tabular-nums text-accent-2">404</p>
      <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.02em]">{t("notFound.title")}</h1>
      <p className="text-muted">{t("notFound.body")}</p>
      <Link href={localizedPath(lang, "/")} className="mt-2 inline-flex h-11 items-center rounded-[10px] border border-line bg-surface px-5 text-sm font-semibold transition-colors duration-150 hover:bg-surface-hover">
        {t("notFound.home")}
      </Link>
    </div>
  );
}
