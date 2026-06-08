import Link from "next/link";
import { getPosts } from "@/lib/api";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LogPage() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">log</h1>
        <p className="text-sm text-zinc-500">Velog · 노션에서 모은 글</p>
      </header>

      {posts.length === 0 ? (
        <p className="text-zinc-500">아직 글이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-col gap-2">
              <Link href={`/log/${post.slug}`} className="group flex flex-col gap-1.5">
                <h2 className="text-lg font-medium tracking-tight group-hover:underline">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
