import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { type Lang } from "@/i18n";
import { ExternalLink } from "lucide-react";
import { getProjects, type Project } from "@/lib/projects";
import SafeImage from "@/components/SafeImage";
import MockupGallery from "@/components/MockupGallery";
import { GithubIcon } from "@/components/icons";
import { MOBILE_OPEN_ONLY, MobileMoreToggle, PageHeader, StackChips } from "@/components/ui";
import { useTranslations } from "next-intl";
import { tFor } from "@/i18n/translator";

export function projectsMetadata(lang: Lang): Metadata {
  const t = tFor(lang);
  return pageMetadata({ title: t("meta.projects.title"), description: t("meta.projects.description"), path: "/projects", lang });
}

function BrowserFrame({ children, fixedAspect = true }: { children: React.ReactNode; fixedAspect?: boolean }) {
  return (
    <div className="w-full rounded-xl border border-line bg-background overflow-hidden">
      <div className={fixedAspect ? "relative aspect-[16/10] flex items-center justify-center" : "relative max-sm:aspect-[16/10] max-sm:overflow-hidden"}>
        {children}
      </div>
    </div>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[240px] max-sm:max-w-[150px] mx-auto">
      <div className="rounded-[28px] border-[6px] border-surface-hover bg-background overflow-hidden">
        <div className="aspect-[9/16] relative overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// preload = 첫 카드(첫 화면에서 가장 큰 요소)만 먼저 불러옴
function ProjectVisual({ project, preload = false }: { project: Project; preload?: boolean }) {
  if (project.thumbnail) {
    if (project.device === "mobile") {
      return (
        <MobileFrame>
          <SafeImage src={project.thumbnail} alt={project.title} fill sizes="240px" preload={preload} className="object-cover" />
        </MobileFrame>
      );
    }
    return (
      <BrowserFrame fixedAspect={false}>
        <SafeImage
          src={project.thumbnail}
          alt={project.title}
          width={1002}
          height={558}
          sizes="(max-width: 1024px) 100vw, 50vw"
          preload={preload}
          // 휴대폰에선 2:1 로 잘리므로 프로젝트별 기준 위치(없으면 위쪽)에 맞춤 - 홈 카드와 같은 값
          className={`w-full h-auto block max-sm:h-full max-sm:object-cover ${project.mobileThumbPosition ?? "max-sm:object-top"}`}
        />
      </BrowserFrame>
    );
  }
  if (project.logo) {
    return (
      <BrowserFrame>
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <SafeImage
            src={project.logo}
            alt={project.title}
            width={800}
            height={800}
            sizes="(max-width: 1024px) 100vw, 50vw"
            preload={preload}
            className="w-full h-full object-contain p-8 max-sm:p-4 mix-blend-multiply"
          />
        </div>
      </BrowserFrame>
    );
  }
  const Frame = project.device === "mobile" ? MobileFrame : BrowserFrame;
  return (
    <Frame>
      <div className="flex flex-col items-center gap-2 text-muted">
        <span className="text-2xl font-medium text-center px-4">{project.title}</span>
      </div>
    </Frame>
  );
}

// 프로젝트 페이지 본문
export default function ProjectsView({ lang }: { lang: Lang }) {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-16 pt-8 pb-6">
      <PageHeader title={t("projects.title")} />

      <div className="flex flex-col gap-16 max-sm:gap-12">
        {getProjects().map((p, i) => (
          <article
            key={p.slug}
            id={p.slug}
            // 홈 카드에서 /projects#slug 로 오면 해당 프로젝트로 스크롤 (상단 고정 헤더만큼 여백) + 위 구분선 강조
            className="relative scroll-mt-24 border-t border-line target:border-accent pt-10 max-sm:pt-6 first:border-t-0 first:pt-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-sm:flex max-sm:flex-col max-sm:items-stretch max-sm:gap-4 group/more"
          >
            {/* 왼쪽: 화면 + 핵심 기능(사용자가 할 수 있는 것) / 오른쪽: 소개 + 내가 맡은 부분 */}
            <div className="flex flex-col gap-6 max-sm:contents">
              <div className="flex flex-col gap-3 max-sm:order-1">
                {/* 목업이 있으면 썸네일 자체가 '화면 둘러보기' 버튼 */}
                {p.mockup ? (
                  <MockupGallery slug={p.slug} title={p.title} mockup={p.mockup} lang={lang}>
                    <ProjectVisual project={p} preload={i === 0} />
                  </MockupGallery>
                ) : (
                  <ProjectVisual project={p} preload={i === 0} />
                )}
              </div>
              <div className="flex flex-col gap-1 max-sm:order-3">
                <p className="text-base text-muted">{p.subtitle}</p>
                <p className="text-lg font-medium leading-snug">{p.tagline}</p>
              </div>
              {/* 휴대폰은 카드마다 '자세히 보기' 버튼 하나로 핵심 기능·맡은 부분·기술을 같이 펼침 */}
              <div className={`flex flex-col gap-2 max-sm:order-4 ${MOBILE_OPEN_ONLY} max-sm:flex-col`}>
                <span className="text-sm font-medium text-muted">{t("projects.features")}</span>
                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed">
                  {p.features.map((f) => (
                    <li key={f} className="relative pl-4 before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-muted">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-5 max-sm:contents">
              <div className="flex flex-col gap-2 max-sm:order-2">
                {/* 대표 · 배포 상태 · 팀장은 배지 대신 글자, 대표만 벽돌색 */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                  {p.pinned && <span className="font-medium text-accent-2">{t("projects.pinned")}</span>}
                  {[
                    p.status !== "local" ? t(p.status === "live" ? "status.live" : "status.released") : null,
                    p.lead ? t("projects.lead") : null,
                  ].filter(Boolean).map((x) => (
                    <span key={x} className="font-medium text-foreground">{x}</span>
                  ))}
                  <span className="tabular-nums">{p.period}</span>
                  <span>·</span>
                  <span>{p.role}</span>
                </div>
                <h2 className="text-3xl max-sm:text-2xl font-medium tracking-[-0.02em]">{p.title}</h2>
              </div>

              <div className={`flex flex-col gap-2 max-sm:order-5 ${MOBILE_OPEN_ONLY} max-sm:flex-col`}>
                <span className="text-sm font-medium text-muted">{t("projects.myPart")}</span>
                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed">
                  {p.myPart.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className={`max-sm:order-6 ${MOBILE_OPEN_ONLY}`}>
                <StackChips items={p.stack} grouped />
              </div>

              <MobileMoreToggle className="max-sm:order-7" lang={lang} />

              {/* 링크 버튼은 한 줄로 - 휴대폰은 버튼을 같은 폭으로 나눠 한 줄에 (360px 미만은 아이콘 생략 - 버튼 3개면 글자만으로 꽉 참) */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2 pt-2 max-sm:order-8 max-sm:flex-nowrap max-sm:gap-1.5 max-sm:pt-0">
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-accent-strong text-on-accent px-5 text-sm font-medium transition-opacity duration-150 hover:opacity-85 max-sm:min-w-0 max-sm:flex-1 max-sm:justify-center max-sm:gap-1 max-sm:px-2 max-sm:text-[13px]"
                  >
                    {t("projects.live")}
                    <ExternalLink className="size-4 shrink-0 max-sm:size-3.5 max-[359px]:hidden" />
                  </a>
                )}
                {p.repos.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] border border-line bg-surface px-5 text-sm font-medium transition-colors duration-150 hover:bg-surface-hover max-sm:min-w-0 max-sm:flex-1 max-sm:justify-center max-sm:gap-1 max-sm:px-2 max-sm:text-[13px]"
                  >
                    <GithubIcon className="size-4 shrink-0 max-sm:size-3.5 max-[359px]:hidden" />
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
