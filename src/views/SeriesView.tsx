import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSeries } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";
import { DATE_LOCALE, localizedPath, type Lang } from "@/i18n";
import LocalDate from "@/components/LocalDate";
import { BackLink } from "@/components/ui";
import SeriesPostList from "@/components/SeriesPostList";
import { getTranslations } from "next-intl/server";
import { tFor } from "@/i18n/translator";

// 시리즈 페이지 본문 · 메타데이터
export async function seriesMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const t = tFor(lang);
  const series = await getSeries(slug);
  if (!series) return {};
  return pageMetadata({
    title: series.name,
    description: series.description || t("meta.series.description", { name: series.name, count: series.posts.length }),
    path: `/series/${slug}`,
    lang,
  });
}

export default async function SeriesView({ slug, lang }: { slug: string; lang: Lang }) {
  const t = await getTranslations();
  const series = await getSeries(slug);
  if (!series) notFound();

  return (
    <div className="flex flex-col gap-12 py-6">
      <BackLink href={localizedPath(lang, "/log")} label={t("series.back")} />

      <header className="flex flex-col gap-4">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em]">{series.name}</h1>
        {series.description && <p className="text-base sm:text-lg text-muted max-w-2xl">{series.description}</p>}
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>{t("series.count", { n: series.postsCount })}</span>
          {series.updatedAt && (
            <>
              <span>·</span>
              <span>{t("log.updatedPrefix")}<LocalDate iso={series.updatedAt} locale={DATE_LOCALE[lang]} />{t("log.updatedSuffix")}</span>
            </>
          )}
        </div>
      </header>

      <SeriesPostList posts={series.posts} lang={lang} />
    </div>
  );
}
