import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Building2, ChevronDown, Mail } from "lucide-react";
import ContributionsCalendar from "@/components/ContributionsCalendar";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { SectionHeader, StackChips } from "@/components/ui";
import { CONTRIBUTIONS_EARLIEST_YEAR, detailText, getContributions, getPosts, type AboutContent } from "@/lib/api";
import { getHomeHighlights } from "@/lib/about";
import SafeImage from "@/components/SafeImage";
import { getProjects } from "@/lib/projects";
import { localizedPath, type Lang } from "@/i18n";
import { yearIn } from "@/lib/time";
import LocalDate from "@/components/LocalDate";
import { getTranslations } from "next-intl/server";

const LATEST_POSTS_COUNT = 3;
const FEATURED_PROJECTS_COUNT = 3;


const PROFILE_IMG = "/img/profile.jpg";
const hasProfileImg = fs.existsSync(path.join(process.cwd(), "public", PROFILE_IMG));

function availableYears(): number[] {
  const now = yearIn();
  const years: number[] = [];
  for (let y = now; y >= CONTRIBUTIONS_EARLIEST_YEAR; y--) years.push(y);
  return years;
}

// 홈 본문 - 이력서 데이터는 src/lib/about.ts 하드코딩
// 정적 페이지(ISR) - 잔디는 최근 1년으로 그리고, 주소의 ?year= 는 잔디 컴포넌트가 브라우저에서 처리
export default async function HomeView({ about, lang }: { about: AboutContent; lang: Lang }) {
  const t = await getTranslations();
  const [contributions, posts] = await Promise.all([
    getContributions().catch(() => null),
    getPosts().catch(() => []),
  ]);

  const profile = about?.profile;
  const contacts = profile?.contacts;
  const careers = [...(about?.careers ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const latestPosts = posts.slice(0, LATEST_POSTS_COUNT);
  const featured = getProjects().slice(0, FEATURED_PROJECTS_COUNT);

  // 숫자 - 커밋 수 같은 활동량 대신 결과 지표 + 근거 한 줄
  const stats = [
    { label: t("home.stat.career"), value: profile?.careerPeriod ?? "-", basis: t("home.stat.careerBasis") },
    ...getHomeHighlights(),
  ];

  return (
    <div className="flex flex-col gap-24 sm:gap-32 py-6">
      {/* Hero - 왼쪽 글 · 오른쪽 사진. 버튼은 주 1개(연락) + 보조 1개(GitHub), 나머지 링크는 아래 연락 칸으로 */}
      <section className="animate-fade-up flex flex-col-reverse sm:flex-row sm:items-center gap-8 sm:gap-12 pt-2">
        <div className="flex flex-col gap-6 min-w-0">
          <div className="flex flex-col gap-3">
            <p className="text-base text-muted">{t("home.greeting", { name: profile?.name ?? "WonJun" })}</p>
            <h1 className="text-4xl sm:text-6xl font-medium tracking-[-0.03em] leading-[1.06]">
              {profile?.tagline ?? t("home.taglineFallback")}
            </h1>
          </div>
          {profile?.intro && (
            <p className="max-w-[36rem] text-base max-sm:text-[15px] sm:text-lg leading-relaxed text-muted whitespace-pre-line">
              {profile.intro}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent-strong px-5 text-sm font-semibold text-foreground transition-opacity duration-150 hover:opacity-85"
              >
                <Mail className="size-4" strokeWidth={1.5} />
                {t("home.contact")}
              </a>
            )}
            {contacts?.githubPersonal && (
              <a
                href={contacts.githubPersonal}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line bg-surface px-5 text-sm font-semibold transition-colors duration-150 hover:bg-surface-hover"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
            )}
          </div>
        </div>
        <div className="relative shrink-0 size-24 sm:size-56 rounded-2xl overflow-hidden border border-line bg-surface flex items-center justify-center">
          {hasProfileImg ? (
            <SafeImage src={PROFILE_IMG} alt={profile?.name ?? "WonJun"} width={416} height={416} sizes="(max-width: 640px) 96px, 224px" preload className="size-full object-cover object-[center_5%]" />
          ) : (
            <span className="text-5xl sm:text-7xl font-medium tracking-tight text-muted/40">WJ</span>
          )}
        </div>
      </section>

      {/* 숫자 - 카드 없이 위 구분선 + 숫자 + 근거 한 줄. 근거 앞 짧은 벽돌색 선 = 사이트 공통 '근거 표기' */}
      <section className="animate-fade-up [animation-delay:50ms] grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 max-sm:grid-cols-1 max-sm:gap-y-0">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2 border-t border-line pt-4 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-4 max-sm:gap-y-1 max-sm:py-4">
            <span className="text-sm text-muted max-sm:col-start-1 max-sm:row-start-1">{s.label}</span>
            <span className="text-3xl max-sm:text-2xl font-medium tabular-nums tracking-[-0.02em] max-sm:col-start-2 max-sm:row-start-1 max-sm:row-span-2 max-sm:self-center max-sm:text-right">{s.value}</span>
            <Basis className="max-sm:col-start-1 max-sm:row-start-2">{s.basis}</Basis>
          </div>
        ))}
      </section>

      {/* Experience - 회사마다 위 구분선, 프로젝트는 구분선 목록(접기) */}
      {careers.length > 0 && (
        <section className="flex flex-col gap-8">
          <SectionHeader title={t("home.experience.title")} href={localizedPath(lang, "/resume")} linkLabel={t("home.experience.link")} />
          <ol className="flex flex-col gap-16 max-sm:gap-12">
            {careers.map((c) => {
              const logo = c.logo; // 회사 로고는 이력서 데이터의 logo 필드(회사명이 언어마다 달라서)
              return (
                <li key={c.id ?? c.company + c.period} className="flex flex-col gap-6 border-t border-line pt-8 max-sm:pt-6">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0 size-12 rounded-lg bg-white flex items-center justify-center overflow-hidden p-1.5">
                      {logo ? (
                        <SafeImage src={logo} alt={c.company} width={96} height={96} sizes="48px" className="size-full object-contain" />
                      ) : (
                        <Building2 className="size-5 text-muted" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold">{c.company}</h3>
                        <span className="text-sm text-muted">
                          {[c.role, c.position].filter(Boolean).join(" · ")}
                        </span>
                      </div>
                      <span className="text-sm tabular-nums text-muted shrink-0">
                        {c.period}
                      </span>
                    </div>
                  </div>
                  {c.summary && <p className="max-w-[48rem] text-base leading-relaxed">{c.summary}</p>}
                  {c.projects && c.projects.length > 0 && (
                    <div className="flex flex-col divide-y divide-line border-y border-line">
                      {c.projects.map((proj) => (
                        <details key={proj.title} className="group">
                          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 transition-colors duration-150 hover:text-accent-2 [&::-webkit-details-marker]:hidden">
                            <span className="text-sm sm:text-base font-medium">{proj.title}</span>
                            <span className="flex items-center gap-3 shrink-0">
                              <span className="hidden sm:inline text-sm tabular-nums text-muted">{proj.period}</span>
                              <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" strokeWidth={1.5} />
                            </span>
                          </summary>
                          <ul className="flex flex-col gap-2 pb-5 text-sm text-muted">
                            {proj.details.map(detailText).map((d) => (
                              <li key={d} className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-muted">
                                {d}
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                    </div>
                  )}
                  {c.stack && <StackChips items={c.stack} lang={lang} />}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Projects - 첫 프로젝트는 크게(왼쪽 2칸), 나머지 둘은 오른쪽에 작게 */}
      <section className="flex flex-col gap-8">
        <SectionHeader title={t("home.projects.title")} href={localizedPath(lang, "/projects")} linkLabel={t("home.projects.link")} />
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-x-8 gap-y-10">
          {featured.map((p, i) => {
            // 홈은 맛보기(이미지 + 한 줄 소개), 핵심 기능·내가 맡은 부분은 /projects 에서
            const visual = p.thumbnail ?? p.logo;
            const lead = i === 0;
            return (
              <Link
                key={p.slug}
                href={`${localizedPath(lang, "/projects")}#${p.slug}`}
                className={`group flex flex-col gap-4 max-sm:gap-3 ${lead ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                {visual && (
                  <div className={`relative overflow-hidden rounded-xl border border-line ${lead ? "aspect-[16/10]" : "aspect-[16/9]"} max-sm:aspect-[5/2] ${p.thumbnail ? "bg-background" : "bg-white"}`}>
                    <SafeImage
                      src={visual}
                      alt={p.title}
                      fill
                      sizes={lead ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      className={p.thumbnail ? `object-cover object-top ${p.mobileThumbPosition ?? ""}` : "object-contain p-6 max-sm:p-3"}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className={`${lead ? "text-2xl max-sm:text-lg" : "text-lg"} font-semibold truncate transition-colors duration-150 group-hover:text-accent-2`}>{p.title}</h3>
                    {p.status !== "local" && (
                      <span className="shrink-0 text-sm text-muted">· {t(p.status === "live" ? "status.live" : "status.released")}</span>
                    )}
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted transition-colors duration-150 group-hover:text-accent-2" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm sm:text-base leading-snug text-muted max-sm:line-clamp-2">{p.tagline}</p>
                </div>
                {/* 큰 카드만 - 오른쪽 두 카드보다 짧아 아래가 비어서 기간 · 역할과 맡은 부분 세 줄을 더함 (한 줄로 쌓이는 좁은 화면은 생략) */}
                {lead && (
                  <div className="flex flex-col gap-3 border-t border-line pt-4 max-md:hidden">
                    <p className="text-sm text-muted">
                      <span className="tabular-nums">{p.period}</span> · {p.role}
                    </p>
                    <ul className="flex flex-col gap-1.5 text-sm leading-relaxed">
                      {p.myPart.slice(0, 3).map((m) => (
                        <li key={m} className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-muted">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity - 글은 날짜 · 제목 목록, 잔디는 한 판(이 화면에서 색이 들어가는 곳). */}
      <section className="flex flex-col gap-8">
        <SectionHeader title={t("home.log.title")} href={localizedPath(lang, "/log")} linkLabel={t("home.log.link")} />
        {latestPosts.length > 0 && (
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid grid-cols-[10rem_minmax(0,1fr)] gap-x-6 gap-y-1 py-5 max-sm:grid-cols-1"
                >
                  {post.publishedAt ? <LocalDate iso={post.publishedAt} numeric className="whitespace-nowrap text-sm tabular-nums text-muted pt-0.5" /> : <span />}
                  <span className="flex flex-col gap-1 min-w-0">
                    <span className="font-medium leading-snug line-clamp-1 transition-colors duration-150 group-hover:text-accent-2">{post.title}</span>
                    {post.excerpt && <span className="text-sm text-muted line-clamp-2 max-sm:line-clamp-2">{post.excerpt}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {contributions && (
          <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 flex flex-col gap-4">
            <ContributionsCalendar initialDays={contributions.days} years={availableYears()} lang={lang} />
          </div>
        )}
      </section>

      {/* Contact - 왼쪽 제목 · 설명, 오른쪽 메일 버튼과 그 아래 글자 링크 (박스 없이). 휴대폰은 위아래로 쌓고 왼쪽 정렬 */}
      <section className="flex flex-col gap-6 border-t border-line pt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:pt-16">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em]">{t("home.cta.title")}</h2>
          <p className="max-w-md text-muted">{t("home.cta.body")}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          {/* 360px 미만은 메일 주소가 버튼 여백·아이콘까지 들어갈 폭이 안 돼서 여백·글자 크기를 줄이고 아이콘 생략 */}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex h-11 max-w-full items-center gap-2 rounded-[10px] bg-accent-strong px-5 text-sm font-semibold text-foreground transition-opacity duration-150 hover:opacity-85 max-[359px]:px-4 max-[359px]:text-[15px]"
            >
              <Mail className="size-4 shrink-0 max-[359px]:hidden" strokeWidth={1.5} />
              {profile.email}
            </a>
          )}
          <div className="flex items-center gap-x-6">
            {contacts?.linkedin && (
              <a href={contacts.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-150 hover:text-foreground">
                <LinkedinIcon className="size-4" />
                LinkedIn
              </a>
            )}
            {contacts?.blog && (
              <a href={contacts.blog} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-150 hover:text-foreground">
                <BookOpen className="size-4" strokeWidth={1.5} />
                Blog
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// 근거 한 줄 - 숫자 아래, 앞에 짧은 벽돌색 선. 수치가 나오는 곳에만 씀
function Basis({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`flex items-center gap-2 text-sm text-muted ${className}`}>
      <span aria-hidden className="h-3 w-px shrink-0 bg-accent" />
      <span className="min-w-0 sm:truncate">{children}</span>
    </span>
  );
}
