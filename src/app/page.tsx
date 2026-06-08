import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">원준</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          백엔드 개발자. 만든 것·배운 것을 기록으로 남깁니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Now
        </h2>
        <ul className="flex flex-col gap-2 text-zinc-700 dark:text-zinc-300">
          <li>· 저니로그 만드는 중 — Spring Boot · Next.js · Neon Postgres</li>
          <li>· 노션/Velog 글을 한 곳으로 모으는 동기화 작업</li>
          <li>· 다음: Vercel 배포, /about · /roadmap · /projects 페이지 확장</li>
        </ul>
      </section>

      <section>
        <Link
          href="/log"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 hover:underline"
        >
          글 보기 →
        </Link>
      </section>
    </div>
  );
}
