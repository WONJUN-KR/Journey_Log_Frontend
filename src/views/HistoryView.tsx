import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { type Lang } from "@/i18n";
import type { RoadmapItem } from "@/lib/api";
import { getHistory } from "@/lib/history";
import { PageHeader } from "@/components/ui";
import { useTranslations } from "next-intl";
import { tFor } from "@/i18n/translator";

export function historyMetadata(lang: Lang): Metadata {
  const t = tFor(lang);
  return pageMetadata({ title: t("meta.history.title"), description: t("meta.history.description"), path: "/history", lang });
}

// period "2024.11" → 연도별로 묶고, 연도·항목 모두 최신이 위
function groupByYear(items: RoadmapItem[], other: string): { year: string; items: RoadmapItem[] }[] {
  const byYear = new Map<string, RoadmapItem[]>();
  for (const it of items) {
    const year = it.period?.slice(0, 4) ?? other;
    byYear.set(year, [...(byYear.get(year) ?? []), it]);
  }
  const newestFirst = (a: RoadmapItem, b: RoadmapItem) =>
    (b.period ?? "").localeCompare(a.period ?? "") || b.sortOrder - a.sortOrder;
  return [...byYear.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, list]) => ({ year, items: list.sort(newestFirst) }));
}

// 연혁 페이지 본문 - 한국어 · 영어 페이지가 같이 씀
export default function HistoryView({ lang }: { lang: Lang }) {
  const t = useTranslations();
  const years = groupByYear(getHistory(lang), t("history.other"));
  // "2024.11" 의 월 → 한국어 "11월" · 영어 "Nov"
  const monthLabel = (period: string) =>
    lang === "en" ? new Date(Date.UTC(2000, Number(period.slice(5, 7)) - 1, 1)).toLocaleString("en-US", { month: "short", timeZone: "UTC" }) : `${period.slice(5, 7)}월`;

  return (
    <div className="flex flex-col gap-12 py-6">
      <PageHeader title={t("history.title")} />

      <div className="flex flex-col">
        {years.map(({ year, items }) => (
          <section key={year} className="grid grid-cols-[72px_minmax(0,1fr)] max-[359px]:grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 max-[359px]:gap-3 sm:gap-8 border-t border-line py-8">
            {/* 연도 - 넓은 화면에선 그 해 항목을 내리는 동안 따라옴. 360px 미만에선 항목 위로 올려 글 칸을 넓힘 */}
            <h2 className="self-start text-2xl sm:text-4xl font-medium tracking-[-0.02em] tabular-nums sm:sticky sm:top-20">
              {year}
            </h2>
            <ol className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="grid grid-cols-[44px_minmax(0,1fr)] gap-3 sm:gap-4">
                  <span className="pt-0.5 text-sm tabular-nums text-muted">{item.period ? monthLabel(item.period) : ""}</span>
                  {/* 긴 문구가 칸을 밀어내지 않게 - 가장 작은 폰(320px)에서 가로 스크롤 생기던 곳 */}
                  <div className="flex flex-col gap-1 min-w-0 break-words">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      {/* 진행 중은 배지 대신 벽돌색 점 + 글자 */}
                      {item.status === "IN_PROGRESS" && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-accent-2">
                          <span aria-hidden className="size-1.5 rounded-full bg-accent" />
                          {t("history.current")}
                        </span>
                      )}
                    </div>
                    {item.description && <p className="text-sm text-muted">{item.description}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
