import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, ChevronDown, ExternalLink, Mail, MapPin } from "lucide-react";
import { detailText, type AboutContent, type CareerDetail, type Evidence } from "@/lib/api";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import SkillGroups from "@/components/SkillGroups";
import PrintButton from "@/components/PrintButton";
import { type Lang } from "@/i18n";
import { MOBILE_OPEN_ONLY_INLINE, MOBILE_OPEN_ONLY_ITEM, MOBILE_TOGGLE, MobileMoreInput, MobileMoreToggle, StackChips } from "@/components/ui";
import { useTranslations } from "next-intl";

// 헤더 - PDF 저장만 버튼(크림색 바탕), 나머지 링크는 글자 링크
const LINK_TEXT = "inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-muted transition-colors duration-150 hover:text-foreground [&>svg]:shrink-0";
const PDF_BUTTON = "inline-flex h-11 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[10px] bg-foreground px-5 text-sm font-semibold text-background transition-opacity duration-150 hover:opacity-85 [&>svg]:shrink-0";

// resume 페이지 본문 - 데이터는 src/lib/about.ts
export default function AboutView({ about, lang = "ko" }: { about: AboutContent; lang?: Lang }) {
  const t = useTranslations();

  const { profile, careers, educations, trainings, certifications, skills, portfolios, military, coverLetter } = about;
  const sortedCareers = [...careers].sort((a, b) => a.sortOrder - b.sortOrder);
  const currentCareer = sortedCareers.find((c) => c.isCurrent);
  const sortedEducations = [...educations].sort((a, b) => a.sortOrder - b.sortOrder);
  const sortedTrainings = [...trainings].sort((a, b) => a.sortOrder - b.sortOrder);
  // 짧은 소개는 휴대폰에서도 다 보여서 접기 없이 그대로
  const coverFolds = coverLetter.length > 800;

  const links = [
    { href: profile.contacts.githubPersonal, label: "GitHub", icon: <GithubIcon className="size-4" /> },
    { href: profile.contacts.blog, label: "Blog", icon: <BookOpen className="size-4" /> },
    { href: profile.contacts.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="size-4" /> },
  ].filter((l): l is typeof l & { href: string } => Boolean(l.href));

  return (
    <div className="flex flex-col gap-20 py-6">
      {/* 상단 헤더 */}
      <header className="animate-fade-up flex flex-col gap-6 pt-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-medium tracking-[-0.03em]">{profile.name}</h1>
          <p className="text-lg sm:text-xl text-muted">{profile.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5"><Mail className="size-4" strokeWidth={1.5} />{profile.email}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" strokeWidth={1.5} />{profile.region}</span>
        </div>
        {/* PDF 저장 버튼 + 글자 링크 한 줄. 인쇄물에선 줄 전체를 숨김 */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 print:hidden">
          <PrintButton fileName={t("resume.pdfFile", { name: profile.name })} label={t("resume.pdf")} className={PDF_BUTTON} />
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={LINK_TEXT}>
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>
      </header>

      {/* 정보 박스 */}
      {/* 이력서 요약 4칸 - 사람인·잡코리아 상단 요약 기준 (총 경력 · 전문 분야 · 최종 학력 · 자격증) */}
      {/* 홈 숫자와 같은 모양(위 구분선). 휴대폰은 한 줄씩 (이름·설명 왼쪽, 값 오른쪽) - 값 칸은 최대 65%, 넘으면 값도 줄바꿈 (긴 값이 화면 밖으로 안 나가게) */}
      <section className="grid grid-cols-2 max-sm:grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-8 max-sm:gap-y-0">
        <InfoBox
          label={t("resume.info.career")}
          value={profile.careerPeriod}
          sub={currentCareer ? t("resume.info.currentAt", { company: currentCareer.company }) : undefined}
        />
        <InfoBox label={t("resume.info.field")} value={t("resume.info.fieldValue")} sub={t("resume.info.fieldSub")} />
        <InfoBox label={t("resume.info.education")} value={t("resume.info.educationValue")} sub={t("resume.info.educationSub")} />
        <InfoBox
          label={t("resume.info.certs")}
          value={certifications.slice(0, 2).map((c) => c.short ?? c.name.replace(/\s*\(.*\)$/, "")).join(" · ")}
          sub={certifications.length > 2 ? t("resume.info.certsMore", { n: certifications.length - 2 }) : undefined}
        />
      </section>

      {coverLetter && (
      <Section title={t("resume.coverLetter")}>
        <div className="max-w-[48rem]">
          {/* 휴대폰은 앞부분만 보여주고 '전체 읽기' ↔ '접기' - JS 없이 체크박스 + :has */}
          <div className="group/cover flex flex-col">
            <div className={coverFolds ? "relative max-sm:max-h-[22rem] max-sm:overflow-hidden max-sm:group-has-[:checked]/cover:max-h-none max-sm:after:absolute max-sm:after:inset-x-0 max-sm:after:bottom-0 max-sm:after:h-24 max-sm:after:bg-gradient-to-t max-sm:after:from-background max-sm:after:to-transparent max-sm:group-has-[:checked]/cover:after:hidden" : undefined}>
              <div className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-a:text-accent-2">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{coverLetter}</ReactMarkdown>
              </div>
            </div>
            {coverFolds && (
            <label data-more-toggle="" className={`sm:hidden mt-3 ${MOBILE_TOGGLE}`}>
              <input type="checkbox" className="peer sr-only" />
              <span className="peer-checked:hidden">{t("resume.readAll")}</span>
              <span className="hidden peer-checked:inline">{t("toggle.less")}</span>
              <ChevronDown className="size-3.5 transition-transform duration-200 peer-checked:rotate-180" />
            </label>
            )}
          </div>
        </div>
      </Section>
      )}

      <Section title={t("resume.skills")}>
        <SkillGroups skills={skills} lang={lang} />
      </Section>

      <Section title={t("resume.experience")} sub={profile.careerPeriod}>
        {/* 휴대폰은 회사마다 프로젝트 제목만 - 기간·상세(작은 글씨)·기술은 내용 아래 '자세히 보기'로 그 회사만 펼침, 같은 버튼이 '접기'로 바뀜 */}
        <Timeline>
          {sortedCareers.map((c, idx) => (
            <TimelineItem key={idx} period={c.period} current={c.isCurrent}>
              <div className="group/more flex flex-col gap-3">
                <MobileMoreInput id={`career-more-${idx}`} />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-lg font-semibold">{c.company}</h3>
                  <span className="text-sm text-muted">{[c.position, c.role].filter(Boolean).join(" · ")}</span>
                </div>
                {c.summary && <p className="text-sm leading-relaxed">{c.summary}</p>}
                {c.projects && c.projects.length > 0 && (
                  <div className="flex flex-col gap-5 mt-1">
                    {c.projects.map((p, pi) => (
                      <div key={pi} className="flex flex-col gap-2 border-t border-line pt-4 print:break-inside-avoid max-sm:gap-0 max-sm:border-0 max-sm:pt-0 max-sm:group-has-[:checked]/more:gap-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                          <h4 className="font-semibold">{p.title}</h4>
                          <span className={`text-sm tabular-nums text-muted ${MOBILE_OPEN_ONLY_INLINE}`}>{p.period}</span>
                        </div>
                        <BulletList items={p.details} mobileKeep={0} lang={lang} />
                      </div>
                    ))}
                  </div>
                )}
                {c.stack && <StackChips items={c.stack} grouped lang={lang} />}
                {/* 자기소개서 '전체 읽기'처럼 내용 아래 버튼 하나 - 자세히 보기 ↔ 접기, 접으면 이 버튼 자리로 화면 복귀 */}
                <MobileMoreToggle htmlFor={`career-more-${idx}`} lang={lang} />
              </div>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {sortedTrainings.length > 0 && (
      <Section title={t("resume.training")}>
        <Timeline>
          {sortedTrainings.map((tr, idx) => (
            <TimelineItem key={idx} period={tr.period}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-lg font-semibold">{tr.org}</h3>
                <span className="text-sm text-muted">{tr.course}</span>
              </div>
              {/* 배운 기술(learned)은 역량과 겹쳐서 안 그림 - 데이터는 about.ts 에 그대로 */}
              {/* 교육 중 사이드 프로젝트는 제목만 ("제목 (팀·기간) - 설명" 에서 설명 앞까지) - 자세한 건 포트폴리오에서 */}
              {tr.projects && tr.projects.length > 0 && <BulletList items={tr.projects.map((x) => x.split(/ - |(?<=\)): /)[0])} lang={lang} />}
            </TimelineItem>
          ))}
        </Timeline>
      </Section>
      )}

      <Section title={t("resume.education")}>
        <Timeline>
          {sortedEducations.map((e, idx) => (
            <TimelineItem key={idx} period={[e.period, e.status].filter(Boolean).join(" · ")}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h3 className="text-lg font-semibold">{e.school}</h3>
                {e.department && <span className="text-sm text-muted">{e.department}</span>}
              </div>
              {(e.region || e.gpa) && (
                <div className="flex flex-wrap gap-x-4 text-sm text-muted">
                  {e.region && <span>{t("resume.region", { v: e.region })}</span>}
                  {e.gpa && <span>{t("resume.gpa", { v: e.gpa })}</span>}
                </div>
              )}
              {e.projects && e.projects.length > 0 && <BulletList items={e.projects} lang={lang} />}
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      {certifications.length > 0 && (
      <Section title={t("resume.certifications")}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          {certifications.map((c, idx) => (
            <li key={idx} className="flex flex-col gap-1 border-t border-line py-4">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted">{c.issuer} · <span className="tabular-nums">{c.acquiredAt}</span></div>
            </li>
          ))}
        </ul>
      </Section>
      )}

      {military && (
        <Section title={t("resume.etc")}>
          <div className="border-t border-line pt-4 text-sm">
            <span className="font-semibold">{t("resume.military")} · {military.status}</span>
            <span className="text-muted"> - {military.type} ({military.period})</span>
          </div>
        </Section>
      )}

      {portfolios.length > 0 && (
      <Section title={t("resume.portfolio")} sub={t("resume.portfolioCount", { n: portfolios.length })}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {portfolios.map((p, idx) => (
            <li key={idx}>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start justify-between gap-3 border-t border-line py-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="font-semibold transition-colors duration-150 group-hover:text-accent-2">{p.title}</div>
                  <div className="text-sm tabular-nums text-muted">
                    {p.period}
                    {p.teamSize && ` · ${t("resume.teamSize", { n: p.teamSize })}`}
                  </div>
                </div>
                <ExternalLink className="size-4 shrink-0 text-muted transition-colors duration-150 group-hover:text-accent-2" strokeWidth={1.5} />
              </a>
            </li>
          ))}
        </ul>
      </Section>
      )}
    </div>
  );
}

function InfoBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-4 max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_fit-content(65%)] max-sm:gap-x-4 max-sm:gap-y-1 max-sm:py-4">
      <div className="text-sm text-muted max-sm:col-start-1 max-sm:row-start-1">{label}</div>
      <div className="text-xl font-medium tabular-nums max-sm:col-start-2 max-sm:row-start-1 max-sm:row-span-2 max-sm:self-center max-sm:text-right max-sm:text-base">{value}</div>
      {sub && <div className="text-sm text-muted max-sm:col-start-1 max-sm:row-start-2">{sub}</div>}
    </div>
  );
}

function Section({ title, sub, children }: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8">
      {/* 인쇄할 때 제목이 페이지 끝에 떨어져 남지 않게 다음 내용과 붙임 */}
      <div className="flex flex-col gap-1.5 print:break-inside-avoid print:break-after-avoid">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em]">{title}</h2>
          {sub && <span className="text-sm text-muted">{sub}</span>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Timeline({ children }: { children: React.ReactNode }) {
  return <ol className="relative flex flex-col gap-10 border-l border-line ml-1.5">{children}</ol>;
}

function TimelineItem({ period, current, children }: {
  period: string;
  current?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pl-5 sm:pl-8 flex flex-col gap-3">
      <span
        className={`absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-background ${
          current ? "bg-accent" : "bg-muted"
        }`}
      />
      <span className="text-sm tabular-nums text-muted">{period}</span>
      {children}
    </li>
  );
}

// mobileKeep 을 주면 휴대폰에선 앞 N개만 보이고 나머지는 바깥 group/more 버튼으로 펼침
function BulletList({ items, mobileKeep, lang }: { items: CareerDetail[]; mobileKeep?: number; lang: Lang }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm text-muted">
      {items.map((d, i) => (
        <li
          key={i}
          className={`relative pl-4 before:absolute before:left-0 before:top-2.5 before:size-1 before:rounded-full before:bg-muted ${
            mobileKeep !== undefined && i >= mobileKeep ? MOBILE_OPEN_ONLY_ITEM : ""
          }`}
        >
          {detailText(d)}
          {typeof d !== "string" && <EvidencePin evidence={d.evidence} lang={lang} />}
        </li>
      ))}
    </ul>
  );
}

// 숫자 줄 끝의 ⓘ - 누르면 측정 방식·환경·시기가 아래로 펼쳐짐 (details/summary 라 JS 없이 동작, 키보드 Enter/Space 로도 열림)
function EvidencePin({ evidence, lang }: { evidence: Evidence; lang: Lang }) {
  const t = useTranslations();
  const rows: [string, string][] = [
    [t("evidence.method"), evidence.method],
    [t("evidence.env"), evidence.env],
    [t("evidence.when"), evidence.when],
  ];
  return (
    <details className="group/pin inline">
      <summary
        aria-label={t("evidence.aria")}
        className="ml-1 inline-flex size-5 cursor-pointer list-none items-center justify-center rounded-full border border-line align-[1px] text-[12px] font-medium leading-none text-muted transition-colors duration-150 hover:text-foreground group-open/pin:bg-surface-hover group-open/pin:text-foreground [&::-webkit-details-marker]:hidden"
      >
        i
      </summary>
      {/* 상자 대신 위 구분선 + 작은 글씨로 본문 아래에 붙임 */}
      <div className="mt-2 mb-1 border-t border-line pt-2 text-sm text-foreground">
        <dl className="grid grid-cols-[minmax(3.25rem,auto)_1fr] gap-x-3 gap-y-1 m-0">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
