"use client";

import { useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Funnel, FunnelX, Layers, Search } from "lucide-react";
import type { PostListItem } from "@/lib/api";
import { SectionHeader } from "@/components/ui";
import { splitSeriesName } from "@/lib/series";
import SafeImage from "@/components/SafeImage";
import LocalDate from "@/components/LocalDate";
import { DATE_LOCALE, type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

// 한 페이지 9개 (3칸 x 3줄), 페이지 번호는 네이버 블로그처럼 10개씩 묶음
const PAGE_SIZE = 9;
const PAGE_GROUP = 10;

// 날짜는 서버에서 문자열로 만들어 넘김 (서버·브라우저 시간대가 달라도 화면이 같도록)
export type LogPost = PostListItem & { seriesIds: string[] };
export type LogSeries = { id: string; name: string; postsCount: number; updatedAt: string | null };

// 기록 목록 - 시리즈 카드는 필터, 검색어는 제목·요약·태그에서 찾음, 썸네일 갤러리를 페이지로 나눔
export default function LogBrowser({ posts, seriesList, lang = "ko" }: { posts: LogPost[]; seriesList: LogSeries[]; lang?: Lang }) {
  const t = useTranslations();
  const locale = DATE_LOCALE[lang];
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (seriesId && !p.seriesIds.includes(seriesId)) return false;
      if (!q) return true;
      return [p.title, p.excerpt ?? "", ...p.tags.map((t) => t.name)].some((s) => s.toLowerCase().includes(q));
    });
  }, [posts, seriesId, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const selected = seriesList.find((s) => s.id === seriesId);
  const groupStart = Math.floor((current - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
  const groupEnd = Math.min(groupStart + PAGE_GROUP - 1, totalPages);

  function goPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectSeries(id: string) {
    setSeriesId((prev) => (prev === id ? null : id));
    setPage(1);
  }

  return (
    <>
      {seriesList.length > 0 && (
        <section className="flex flex-col gap-8">
          {/* 화면엔 안 보이는 구역 제목 - 페이지 제목(h1) 다음에 시리즈 카드 제목(h3)이 바로 오면 제목 단계가 건너뛰어짐 */}
          <h2 className="sr-only">{t("log.seriesHeading")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {seriesList.map((series) => {
              const active = series.id === seriesId;
              const { title, years } = splitSeriesName(series.name);
              return (
                <button
                  key={series.id}
                  type="button"
                  onClick={() => selectSeries(series.id)}
                  aria-pressed={active}
                  className={`group flex flex-col gap-3 sm:gap-4 rounded-xl border p-4 sm:p-5 text-left transition-colors duration-150 max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)_auto] max-sm:items-center max-sm:gap-x-3 max-sm:gap-y-0.5 max-sm:px-4 max-sm:py-3 ${
                    active ? "border-accent bg-surface-hover" : "border-line bg-surface hover:bg-surface-hover"
                  }`}
                >
                  {/* 오른쪽 위 깔때기 = 누르면 이 시리즈 글만 걸러짐 (선택 중이면 해제 아이콘)
                      휴대폰은 세로 한 줄 카드: [아이콘] [연도·제목 / 글 수·업데이트] [깔때기] */}
                  <div className="flex items-start justify-between gap-3 max-sm:contents">
                    <span className="flex size-5 items-center justify-center max-sm:col-start-1 max-sm:row-span-2 max-sm:row-start-1">
                      <Layers className="size-[18px] text-muted" strokeWidth={1.5} />
                    </span>
                    {active ? (
                      <FunnelX strokeWidth={1.5} className="size-[18px] text-accent-2 max-sm:col-start-3 max-sm:row-span-2 max-sm:row-start-1" aria-label={t("log.filterClear")} />
                    ) : (
                      <Funnel strokeWidth={1.5} className="size-[18px] text-muted transition-colors duration-150 group-hover:text-foreground max-sm:col-start-3 max-sm:row-span-2 max-sm:row-start-1" aria-label={t("log.filterBy")} />
                    )}
                  </div>
                  {/* 360px 미만은 연도를 제목 위로, 글 수·날짜를 짧게 */}
                  <div className="flex flex-col gap-1 max-sm:col-start-2 max-sm:row-start-1 max-sm:min-w-0 max-sm:gap-0 min-[360px]:max-sm:flex-row min-[360px]:max-sm:items-baseline min-[360px]:max-sm:gap-2">
                    {years && <span className="text-sm tabular-nums text-muted max-sm:shrink-0">{years}</span>}
                    <h3 className="text-lg font-semibold max-sm:truncate max-sm:text-base">{title}</h3>
                  </div>
                  {/* 날짜는 숫자형(2026-01-26) - 긴 한글 날짜는 카드 폭에서 두 줄로 꺾였음 */}
                  <div className="flex items-center gap-2 whitespace-nowrap text-sm text-muted max-sm:col-start-2 max-sm:row-start-2 max-sm:min-w-0 max-sm:gap-1.5 max-sm:overflow-hidden max-sm:whitespace-nowrap">
                    <span className="shrink-0">{t("log.countShort", { n: series.postsCount })}<span className="max-[359px]:hidden">{t("log.countSuffix")}</span></span>
                    {series.updatedAt && (
                      <>
                        <span>·</span>
                        <span className="max-sm:truncate"><span className="max-[359px]:hidden">{t("log.updatedPrefix")}</span><LocalDate iso={series.updatedAt} locale={locale} numeric /><span className="max-[359px]:hidden">{t("log.updatedSuffix")}</span></span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-8">
        {/* 제목 왼쪽, 검색창 오른쪽 한 줄 (좁은 화면에선 아래로) */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* 시리즈 선택 시: 작은 글씨 = 시리즈 이름·연도, 큰 제목 = 글 수 */}
          <SectionHeader
            eyebrow={selected ? seriesHeading(selected.name) : undefined}
            title={t(selected ? "log.filtered" : "log.all", { n: filtered.length })}
          />
          <div className="flex items-center gap-2">
            <label className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={t("log.search")}
                className="h-11 w-full rounded-[10px] border border-line bg-surface pl-11 pr-4 text-sm placeholder:text-muted focus:border-accent/60 focus:outline-none"
              />
            </label>
            {selected && (
              <button
                type="button"
                onClick={() => selectSeries(selected.id)}
                className="h-11 shrink-0 rounded-[10px] border border-line bg-surface px-4 text-sm font-semibold transition-colors duration-150 hover:bg-surface-hover"
              >
                {t("log.clearSeries")}
              </button>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-muted">{t(posts.length === 0 ? "log.empty" : "log.noMatch")}</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6">
            {visible.map((post, idx) => (
              <li key={post.id}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col gap-3"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-surface">
                    {post.thumbnail ? (
                      // 썸네일은 public/blog/naver 에 받아 둔 파일 (빌드 전에 크기별 WebP 로 줄여 둔 걸 로더가 고름)
                      // 첫 줄(휴대폰 2칸·PC 3칸)은 첫 화면이라 먼저 불러오고 나머지는 스크롤할 때
                      <SafeImage
                        src={post.thumbnail}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                        preload={idx < 3}
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <BookOpen className="size-8 text-muted/40" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold line-clamp-2 transition-colors duration-150 group-hover:text-accent-2">
                      {post.title}
                    </h3>
                    {post.publishedAt && <LocalDate iso={post.publishedAt} locale={locale} className="text-sm tabular-nums text-muted" />}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1" aria-label={t("log.pagesAria")}>
            {/* 이전·다음은 10페이지 묶음 단위로 넘김 */}
            {groupStart > 1 && (
              <PageButton onClick={() => goPage(groupStart - 1)} label={t("log.prevPages")}>
                <ChevronLeft className="size-4" />
              </PageButton>
            )}
            {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((n) => (
              <PageButton key={n} active={n === current} onClick={() => goPage(n)} label={t("log.page", { n })}>
                {n}
              </PageButton>
            ))}
            {groupEnd < totalPages && (
              <PageButton onClick={() => goPage(groupEnd + 1)} label={t("log.nextPages")}>
                <ChevronRight className="size-4" />
              </PageButton>
            )}
          </nav>
        )}
      </section>
    </>
  );
}

// 선택한 시리즈 표시 - "취업준비 기록지 · 2026"
function seriesHeading(name: string): string {
  const { title, years } = splitSeriesName(name);
  return years ? `${title} · ${years}` : title;
}

function PageButton({ children, onClick, label, active = false }: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`flex size-9 items-center justify-center rounded-lg text-sm tabular-nums font-semibold transition-colors duration-150 ${
        active ? "bg-accent-strong text-foreground" : "text-muted hover:bg-surface-hover hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
