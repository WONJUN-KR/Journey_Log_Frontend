"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SeriesPostItem } from "@/lib/api";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Order = "asc" | "desc";

export default function SeriesPostList({ posts }: { posts: SeriesPostItem[] }) {
  const [order, setOrder] = useState<Order>("desc");

  const sorted = useMemo(() => {
    const copy = [...posts];
    if (order === "desc") copy.reverse();
    return copy;
  }, [posts, order]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => setOrder("asc")}
          className={
            order === "asc"
              ? "font-medium text-zinc-950 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }
        >
          오래된 순
        </button>
        <span className="text-zinc-300 dark:text-zinc-700">|</span>
        <button
          type="button"
          onClick={() => setOrder("desc")}
          className={
            order === "desc"
              ? "font-medium text-zinc-950 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }
        >
          최신 순
        </button>
      </div>

      <ol className="flex flex-col gap-6">
        {sorted.map((post) => (
          <li key={post.id} className="flex gap-4">
            <span className="font-mono text-sm text-zinc-400 pt-0.5 w-6 text-right shrink-0">
              {post.seriesIndex ?? "·"}
            </span>
            <div className="flex flex-col gap-1.5 flex-1">
              <Link href={`/log/${post.slug}`} className="group flex flex-col gap-1.5">
                <h2 className="font-medium tracking-tight group-hover:underline">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                <time>{formatDate(post.publishedAt)}</time>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-800"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
