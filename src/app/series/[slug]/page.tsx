import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeries } from "@/lib/api";
import SeriesPostList from "./SeriesPostList";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SeriesPage({ params }: PageProps) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  return (
    <div className="flex flex-col gap-10">
      <Link href="/log" className="text-sm text-zinc-500 hover:underline w-fit">
        ← log
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">{series.name}</h1>
        {series.description && (
          <p className="text-zinc-600 dark:text-zinc-400">{series.description}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span>{series.postsCount}개 글</span>
          {series.updatedAt && (
            <>
              <span>·</span>
              <span>{formatDate(series.updatedAt)} 업데이트</span>
            </>
          )}
        </div>
      </header>

      <SeriesPostList posts={series.posts} />
    </div>
  );
}
