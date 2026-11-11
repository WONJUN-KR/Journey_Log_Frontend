"use client";

import { useMemo, useState } from "react";
import type { SeriesPostItem } from "@/lib/api";
import LocalDate from "@/components/LocalDate";
import { TagList } from "@/components/ui";
import { DATE_LOCALE, type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

type Order = "asc" | "desc";

const ORDER_OPTIONS = [
  { value: "desc", label: "series.newest" },
  { value: "asc", label: "series.oldest" },
] as const satisfies readonly { value: Order; label: string }[];

export default function SeriesPostList({ posts, lang = "ko" }: { posts: SeriesPostItem[]; lang?: Lang }) {
  const t = useTranslations();
  const locale = DATE_LOCALE[lang];
  const [order, setOrder] = useState<Order>("desc");

  const sorted = useMemo(() => {
    const copy = [...posts];
    if (order === "desc") copy.reverse();
    return copy;
  }, [posts, order]);

  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit rounded-[10px] border border-line bg-surface p-1 text-sm">
        {ORDER_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setOrder(o.value)}
            className={`rounded-md px-4 py-1.5 transition-colors duration-150 ${
              order === o.value ? "bg-surface-hover text-foreground font-medium" : "text-muted hover:text-foreground"
            }`}
          >
            {t(o.label)}
          </button>
        ))}
      </div>

      <ol className="flex flex-col divide-y divide-line border-y border-line">
        {sorted.map((post) => (
          <li key={post.id}>
            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-5 py-6 -mx-3 rounded-lg px-3 transition-colors duration-150 hover:bg-surface-hover"
            >
              <span className="w-8 shrink-0 pt-0.5 tabular-nums text-sm text-muted">
                {post.seriesIndex ?? "·"}
              </span>
              <div className="flex flex-col gap-2 min-w-0">
                <h2 className="text-lg font-medium">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-muted line-clamp-2">{post.excerpt}</p>}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {post.publishedAt && <LocalDate iso={post.publishedAt} locale={locale} className="text-sm tabular-nums text-muted" />}
                  <TagList tags={post.tags} />
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
