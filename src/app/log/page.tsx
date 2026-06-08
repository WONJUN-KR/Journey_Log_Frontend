import Link from "next/link";
import { getPosts, getSeriesList } from "@/lib/api";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LogPage() {
  const [seriesList, posts] = await Promise.all([getSeriesList(), getPosts()]);

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">log</h1>
        <p className="text-sm text-zinc-500">Velog · 노션에서 모은 글</p>
      </header>

      {seriesList.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Series
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {seriesList.map((series) => (
              <Link
                key={series.id}
                href={`/series/${series.slug}`}
                className="flex flex-col gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <h3 className="font-medium tracking-tight">{series.name}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>{series.postsCount}개 글</span>
                  {series.updatedAt && (
                    <>
                      <span>·</span>
                      <span>{formatDate(series.updatedAt)} 업데이트</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          All posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-zinc-500">아직 글이 없습니다.</p>
        ) : (
          <ul className="flex flex-col gap-8">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-col gap-2">
                <Link href={`/log/${post.slug}`} className="group flex flex-col gap-1.5">
                  <h3 className="text-lg font-medium tracking-tight group-hover:underline">
                    {post.title}
                  </h3>
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
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
